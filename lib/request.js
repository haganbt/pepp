"use strict";

const config = require('config');
const rp = require('request-promise');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');

//Expose req/res debug
const logLevel = config.get("app.log_level");
if(logLevel === "debug"){
    require("request-debug")(rp);
}


//todo - build dynamically from config
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
    return rp(requestObj);
};


/**
 * recursivePoll - Recursively poll for a given task id.
 * @param requestObj - the request object set to /task
 * @param taskResponse - the response from the task api i.e. the task id
 * @returns {Promise}
 */
const recursivePoll = function recursivePoll(requestObj, taskResponse){

    if (taskResponse.id === undefined) {
        throw new Error('Missing parameter: taskId');
    }

    const taskId = taskResponse.id;

    return new Promise(function(resolve, reject) {
        function next() {

            options.uri = uri + taskId;
            log.trace("Making /task GET request for:", taskId);

            request.make(options)
                .then(function(resData) {
                    if (resData && resData.status.toLowerCase() === "failed") {
                        return reject("Task failed:",taskId);
                    }

                    if (resData && resData.status.toLowerCase() === "completed") {
                        log.trace("Task completed:", taskId);
                        return resolve(queue.responseHandler(requestObj, resData));
                    }
                    setTimeout(next, 3000);
                }, reject);
        }
        next();
    });
};


exports.make = make;
exports.recursivePoll = recursivePoll;
