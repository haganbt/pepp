"use strict";

const config = require('config');
const rp = require('request-promise');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');
const requestFactory = require("./requestFactory").requestFactory;
const cacheHelper = require('./helpers/cache');
const requestStats = require("./helpers/requestStats");
const retryHelper = require("./helpers/retry");
const spinner = require("./helpers/spinner");

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

    // log request stats
    requestStats.add(requestObj.method, requestObj.uri);

    if(spinner.isSpinning() === false){
        spinner.start();
    }

    reqCount++;
    spinner.update("--> [" + resCount + "/" + reqCount + "]");

    function halt() {
        return new Promise(
            function (resolve, reject) {
                setTimeout(function(){
                    return resolve();
                }, 0)
            });
    }

        return halt()
            .then(response => {
                return rp(requestObj)
            })
            .then(function(response){

                resCount++;
                spinner.update("<-- [" + resCount + "/" + reqCount + "]");

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

    const getTask = {
        "api_resource": "get_task",
        "taskId": taskResponse.id
    };

    const getRequest = requestFactory(getTask);

    return new Promise(function(resolve, reject) {
        function next() {

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
                            "normalizedTask": normalizedTask,
                            "statusCode": resData.statusCode
                        };

                        return reject(err);
                    }

                    if (resData && resData.status && resData.status.toLowerCase() === "completed") {
                        log.trace("Task completed:", taskResponse.id);
                        return resolve(queue.responseHandler(normalizedTask, resData));
                    }

                    setTimeout(next, t * count++);
                })
                .catch(function (err) {

                    // count the failed request
                    retryHelper.setFailed(getRequest);

                    if(retryHelper.shouldRetry(getRequest) === true){

                        let attempts = retryHelper.getAttempts(getRequest);

                        log.warn("GET task " + taskResponse.id + " failed (error " + err.statusCode + "). Retry "
                            + attempts + "...");

                        next();

                    } else {

                        log.error("/GET failed after 3 attempts, killing request " + taskResponse.id);

                        // Set GET request in error
                        err.request = getRequest;
                        return reject(err);
                    }
                });
        }
        setTimeout(next, 10000); // wait before first poll
    });
};


exports.make = make;
exports.recursivePoll = recursivePoll;
