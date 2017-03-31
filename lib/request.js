"use strict";

const config = require("config");
const rp = require("request-promise");

const requestFactory = require("./requestFactory").requestFactory;

const log = require("./helpers/logger");

const t = 10000;
let count = 1;

const submit = async function(req, task){
  
  // analysis tag
  if (task.analysis_tag) {
    return responseHandler(task, task.analysis_tag);
  }

  const id = await rp(req);
  // todo - error checking for id
  const getTask = {
    api_resource: "get_task",
    taskId: id.id
  };

  const results = await recursivePoll(requestFactory(getTask));



  console.log(results);

  console.log("######################");


};





const recursivePoll = async function(options) {

    const results = await rp(options);

    if (results.status && results.status.toLowerCase() === "completed") {
      log.warn(`Recursive poll returning: ${results.status}`);
      return results;
    }

    log.warn(`Recursive poll returning: ${results.status}`);

    setTimeout(recursivePoll(options), 8000 * count++);
};







exports.submit = submit;
