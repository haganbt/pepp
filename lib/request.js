"use strict";

const rp = require("request-promise");

const requestFactory = require("./requestFactory").requestFactory;
const response = require("./response");
const log = require("./helpers/logger");

const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_INTERVAL = 3 * 1000;

/**
 * Submit the task and return the task id.
 * @param req
 */
const getTaskId = function(req) {
  return rp(req).then(result => {
    return result.id;
  });
};

/**
 * Build req params for a GET task
 * @param id
 * @returns {*}
 */
const buildGetTask = function(id) {
  const getTask = {
    api_resource: "get_task",
    taskId: id
  };
  return requestFactory(getTask);
};

/**
 * Timeout helper
 * @param interval
 */
const timeout = interval => new Promise(resolve => {
  setTimeout(
    () => {
      resolve();
    },
    interval
  );
});

/**
 * Check if the taks status is complete
 * @param res
 * @returns {boolean}
 */
const match = function(res) {
  return res.status && res.status.toLowerCase() === "completed" ? true : false;
};

/**
 * Poll for a task until we get a completed task.
 * @param options
 */
const pollingRequest = options => new Promise(async (resolve, reject) => {
  try {
    let retryCounter = 1;
    let response = await rp(options);
    let isMatch = match(response);

    if (isMatch) return resolve(response);

    while (!isMatch && retryCounter < DEFAULT_MAX_RETRIES) {
      await timeout(DEFAULT_INTERVAL * retryCounter);
      response = await rp(options);
      isMatch = match(response);
      log.trace(
        `Polling ${retryCounter}/${DEFAULT_MAX_RETRIES} with interval ${DEFAULT_INTERVAL * retryCounter}: ${response.status}`
      );
      retryCounter += 1;
    }

    if (isMatch) {
      return resolve(response);
    }

    log.error(
      `Polling failed to get success message after ${retryCounter} attempts.`
    );
    log.error(`Respones ${response}`);

    return reject(
      new Error(
        `Polling failed to get success message after ${retryCounter} attempts.`
      )
    );
  } catch (e) {
    log.error(e);
  }
});

/**
 * Main controller for polling and returing results
 * @param req
 * @param task
 * @returns {Promise.<*>}
 */
const make = async function(req, task) {

  if (task.analysis_tag) {
    return response.process(task, task.analysis_tag);
  }

  const taskId = await getTaskId(req);
  const responseData = await pollingRequest(buildGetTask(taskId));

  return response.process(task, responseData);
};

exports.make = make;
