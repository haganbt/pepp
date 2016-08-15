"use strict";

const config = require('config');
const rp = require('request-promise');
var _progress = require('cli-progress');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');

//Expose req/res debug
const logLevel = config.get("app.log_level");
if(logLevel === "debug"){
    require("request-debug")(rp);
}

let reqCount = 0;
let resCount = 0;

//todo - use requestFactory
const uri = "http://api-linkedin-prod.devms.net/v1.4/pylon/linkedin/task/";
var options = {
    auth: {
        'user': process.env.AUTH_USER || (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""),
        'pass': process.env.AUTH_KEY || (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""),
    },
    json: true
};


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
 * @param taskResponse - the response from the task api i.e. the task id
 * @returns {Promise}
 */
const recursivePoll = function recursivePoll(normalizedTask, taskResponse){

    if (taskResponse.id === undefined) {
        throw new Error('Expecting a taskId parameter from a /task submission.');
    }

    const taskId = taskResponse.id;
    const t = 3000;
    let count = 1;

    return new Promise(function(resolve, reject) {
        function next() {

            options.uri = uri + taskId;
            log.info("Polling /task GET request for:", taskId);

            request.make(options)
                .then(function(resData) {
                    if (resData && resData.status.toLowerCase() === "failed") {
                        return reject("Task failed:", taskId);
                    }

                    if (resData && resData.status.toLowerCase() === "completed") {
                        log.trace("Task completed:", taskId);
                        return resolve(queue.responseHandler(normalizedTask, resData));
                    }
                    setTimeout(next, t * count++);
                }, reject);
        }
        next();
    });
};


exports.make = make;
exports.recursivePoll = recursivePoll;
