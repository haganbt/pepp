"use strict";
const Queue = require("promise-queue");
const config = require("config");
const _ = require("underscore");
const moment = require("moment");

const request = require("./request");
const taskManager = require("./taskManager");
const taskHelper = require("./helpers/task");
const cacheHelper = require("./helpers/cache");
const log = require("./helpers/logger");
const requestFactory = require("./requestFactory").requestFactory;

const maxConcurrent = process.env.MAX_PARALLEL_TASKS ||
  (config.has("app.max_parallel_tasks")
    ? config.get("app.max_parallel_tasks")
    : 3);
const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);



/**
 * responseHandler - process the response
 *
 * @param {normalizedTask} - the normalizedTask obj that generated the response
 * @param {response} - the response obj from the request
 * @returns {*}
 */
const responseHandler = function(normalizedTask, response) {

  log.trace("PROCESSING normalizedTask:", JSON.stringify(normalizedTask, undefined, 4));
  log.trace("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));

  let responseData;

  if (_.has(normalizedTask, "analysis_tag")) {
    responseData = normalizedTask.analysis_tag;
  } else {
    responseData = taskHelper.normalizeResponse(normalizedTask.api_resource, response);
  }



  // Task as child tasks, build requests and add to queue
  if (_.has(normalizedTask, "then")) {

    const nextTasks = taskManager.buildNextTasks(normalizedTask, responseData);

    return Promise.all(
      nextTasks.map(each => {
        const requestObject = requestFactory(each);
        return queueRequest(requestObject, each);
      })
    )

  }


  // convert any timeSeries results from unix to human
  // todo - do this before storing to cache
  responseData = taskHelper.resUnixTsToHuman(normalizedTask.analysis_type, responseData);


  // Cache

  // If this is a custom nested, we may have a merge key from the parent task.
  // If not, se this to be undefined and within the cache, we use the result keys
  // as the merge key.
  const mergeKey = normalizedTask.cache.mergeKey || undefined;

  // always save every response results
  cacheHelper.addData(
    normalizedTask.cache.cacheId,
    mergeKey,
    responseData
  );
  cacheHelper.decrement(normalizedTask.cache.cacheId);
  cacheHelper.debugAll();

  const cacheData = cacheHelper.get(normalizedTask.cache.cacheId);

  if (cacheData.remainingTasks === 0) {

    log.trace("Response handler returning with remaining tasks = 0...");
    console.log("---");
    console.log(cacheData);

    delete cacheData.remainingTasks;
    return cacheData;
  } else {
    log.trace("Response handler returning empty, waiting on more tasks.");
    return;
  }

};

/**
 * queueRequest - add request obj to queue and pass
 * the results to the responseHandler()
 *
 * @param requestObj - a request object
 * @returns {LocalPromise}
 */
const queueRequest = function queueRequest(requestObj, normalizedTask) {

  if (_.has(normalizedTask, "analysis_tag")) {
    log.trace("Building FILTER for freqDist using analysis tag");
    return responseHandler(normalizedTask, normalizedTask.analysis_tag);
  }

  return queue
    .add(() => {
      return request.make(requestObj);
    })
    .then(response => {
      if (normalizedTask.api_resource === "analyze") {
        log.trace("Handling response from /analyze..");

        return responseHandler(normalizedTask, response);
      }

      log.trace("Polling for response from /task...");

      return request.recursivePoll(normalizedTask, requestObj, response);
    })
    .catch(err => {
      // Req failed, drop from cache so we return a partial data set
      if (normalizedTask.cache) {
        log.warn(
          "Data dropped due to task failure with key: \"" +
            normalizedTask.cache.mergeKey +
            "\""
        );
        cacheHelper.setFailed(normalizedTask.cache);
      }

      if (err.error && err.error.error) {
        log.error("MESSAGE:", err.error.error);
        log.error("CODE:", err.statusCode);
        log.error(
          "TASK:",
          err.normalizedTask
            ? JSON.stringify(err.normalizedTask, undefined, 4)
            : JSON.stringify(normalizedTask, undefined, 4)
        );
        log.error(
          "REQUEST:",
          err.request
            ? JSON.stringify(err.request, undefined, 4)
            : JSON.stringify(requestObj, undefined, 4)
        );
      } else {
        log.error(err);
      }
      // process.exit(1);
    });
};

exports.queueRequest = queueRequest;
exports.responseHandler = responseHandler;
