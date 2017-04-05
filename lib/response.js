"use strict";

const config = require("config");
const _ = require("underscore");
const moment = require("moment");

const request = require("./request");
const taskManager = require("./taskManager");
const taskHelper = require("./helpers/task");
const cacheHelper = require("./helpers/cache");
const log = require("./helpers/logger");
const requestFactory = require("./requestFactory").requestFactory;


/**
 * handle - process the response
 *
 * @param {normalizedTask} - the normalizedTask obj that generated the response
 * @param {response} - the response obj from the request
 * @returns {*}
 */
const process = async function(normalizedTask, response) {

  log.trace("PROCESSING normalizedTask:", JSON.stringify(normalizedTask, undefined, 4));
  log.trace("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));

  let responseData;

  if (_.has(normalizedTask, "analysis_tag")) {
    responseData = normalizedTask.analysis_tag;
  } else {
    responseData = taskHelper.normalizeResponse(normalizedTask.api_resource, response);
  }


  // Build child tasks and process
  if (_.has(normalizedTask, "then")) {

    const nextTasks = taskManager.buildNextTasks(normalizedTask, responseData);

    let allRequests = [];

    nextTasks.map(eachTask => {
      allRequests.push(request.make(requestFactory(eachTask), eachTask));
    });

    return await Promise.all(allRequests);
  }

  // convert any timeSeries results from unix to human
  // todo - do this before storing to cache
  responseData = taskHelper.resUnixTsToHuman(normalizedTask.analysis_type, responseData);


  // Cache
  // todo - refactor this to seperate function

  // If this is a custom nested, we may have a merge key from the parent task.
  // If not, set this to be undefined and within the cache, we use the result keys
  // as the merge key.
  const mergeKey = normalizedTask.cache.mergeKey || undefined;

  // always save every result set
  cacheHelper.addData(
    normalizedTask.cache.cacheId,
    mergeKey,
    responseData
  );
  cacheHelper.decrement(normalizedTask.cache.cacheId);
  cacheHelper.debugAll();

  const cacheData = cacheHelper.get(normalizedTask.cache.cacheId);

  if (cacheData.remainingTasks === 0) {
    log.trace("Response processor returning with remaining tasks = 0");

    console.log("---");
    console.log(cacheData);

    delete cacheData.remainingTasks;
    return cacheData;
  }

};

exports.process = process;
