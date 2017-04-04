"use strict";

const config = require("config");
const rp = require("request-promise");

const requestFactory = require("./requestFactory").requestFactory;

const log = require("./helpers/logger");


const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_INTERVAL = 1 * 60 * 1000;


const t = 10000;
let count = 1;


const getTaskId = function(req){
  return rp(req).then(result => {
    return result.id;
  })
};

const buildGetTask = function(id) {
  const getTask = {
    api_resource: "get_task",
    taskId: id
  };
  return requestFactory(getTask)
};

const getJSON = (url, opts) =>
  new Promise((resolve, reject) => {
    request(url, opts, (err, responseObj, responseBody) => {
      if (err) reject(err)
      return resolve(responseBody)
    })
  });

const timeout = (interval) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, interval)
  });



const pollingRequest = (req) =>
  new Promise(async (resolve, reject) => {

    let retryCounter = 1;
    let response = await rp(req);

    // early return if initial call matched the expected response
    if (response.status === 'completed') return resolve(response);

    while (response.status !== 'completed' && retryCounter < config.maxRetries) {
      await timeout(config.interval);
      response = await rp(req);
      console.log(`polling ${retryCounter}/${config.maxRetries}: ${isMatch}`);
      retryCounter += 1
    }

    if (response.status === 'completed') {
      return resolve(response);
    }

    if (config.verbose) console.log(`        response ${JSON.stringify(response)} didn't contain expected body after ${config.interval * config.maxRetries / 1000} seconds`);
    return reject(new Error(`Timeout error. Response ${JSON.stringify(response)} didn't contain expected body after ${config.interval * config.maxRetries / 1000} seconds`))
  });







const submit = async function(req, task){

  if (task.analysis_tag) {
    return responseHandler(task, task.analysis_tag);
  }

  const taskId = await getTaskId(req);

  const getTask = buildGetTask(taskId);

  const res = pollingRequest(getTask);


  console.log(res);
  console.log("######################");


};





const recursivePoll = function(options) {
  return new Promise(function (resolve, reject) {
  rp(options).then(res => {
    if (res.status && res.status.toLowerCase() === "completed") {


        return resolve(res);


    } else {

      setTimeout(recursivePoll(options), 8000 * count++);
    }
  });
  });




  /*
  return new Promise(function (resolve, reject) {
    rp(options).then(res => {

      if (res.status && res.status.toLowerCase() === "completed") {
        log.warn(`Recursive poll returning: ${res.status}`);
        return resolve(res);
      }

      log.warn(`Recursive poll returning: ${res.status}`);

      setTimeout(recursivePoll(options), 8000 * count++);

    });
  });
*/
};







exports.submit = submit;
