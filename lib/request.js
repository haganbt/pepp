"use strict";

const config = require('config');
const rp = require('request-promise');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');
const requestFactory = require("./requestFactory").requestFactory;
const cacheHelper = require('./helpers/cache');

//Expose req/res debug
const logLevel = config.get("app.log_level");
if(logLevel === "debug"){
    require("request-debug")(rp);
}

let reqCount = 0;
let resCount = 0;


/**
 * make - execute HTTP request
 * @param requestObj
 * @returns {LocalPromise}
 */
const make = function make(requestObj) {
    reqCount++;
    log.info("--> [" + resCount + "/" + reqCount + "]");

    return rp(requestObj)
        .then(function(response){
            resCount++;
            log.info("<-- [" + resCount + "/" + reqCount + "]");
            return response;
        });
};


/**
 * recursivePoll - Recursively poll for a given task id.
 *
 * @param normalizedTask - the normalizedTask object that created the request
 * @param - requestObj - the request that created the task
 * @param taskResponse - the response from the task api i.e. the task id
 * @returns {Promise}
 */
const recursivePoll = function recursivePoll(normalizedTask, requestObj, taskResponse){

    if (taskResponse.id === undefined) {
        throw new Error('Expecting a taskId parameter from a /task submission.');
    }

    const taskId = taskResponse.id;
    const t = 10000;
    let count = 1;

    return new Promise(function(resolve, reject) {
        function next() {

            let getTask = {
                "api_resource": "get_task",
                "taskId": taskResponse.id
            };

            const getRequest = requestFactory(getTask);

            log.trace("Polling /task GET request for:", taskResponse.id);

            request.make(getRequest)
                .then(function(resData) {
                    if (resData && resData.status && resData.status.toLowerCase() === "failed") {

                        if(normalizedTask.cache) {
                            log.warn("Data dropped due to task failure with key:", normalizedTask.cache.mergeKey);
                            cacheHelper.setFailed(normalizedTask.cache);
                        }

                        let err = {
                            "error": {
                                "error": "Task collected with status of FAILED."
                            },
                            "request": requestObj,
                            "normalizedTask": normalizedTask
                        };

                        return reject(err);
                    }

                    if (resData && resData.status && resData.status.toLowerCase() === "completed") {
                        log.trace("Task completed:", taskResponse.id);
                        return resolve(queue.responseHandler(normalizedTask, resData));
                    }

                    setTimeout(next, t * count++);
                }, reject);
        }
        setTimeout(next, 10000); // wait before first poll
    });
};


exports.make = make;
exports.recursivePoll = recursivePoll;
