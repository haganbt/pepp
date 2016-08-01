"use strict";

const config = require('config');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');

const uri = "http://api-linkedin-prod.devms.net/v1.4/pylon/linkedin/task/";

var options = {
    auth: {
        'user': process.env.AUTH_USER || (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""),
        'pass': process.env.AUTH_KEY || (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""),
    },
    json: true
};

function recursivePoll(delay = 3000, taskId){

    if (taskId === undefined) {
        throw new Error('Missing parameter: taskId');
    }

    return new Promise(function(resolve, reject) {
        function next() {

            options.uri = uri + taskId;
            log.info("Making /task GET request for:", taskId);

            request.make(options)
                .then(function(resData) {
                    if (resData && resData.status.toLowerCase() === "failed") {
                        return reject("Task failed:",taskId);
                    }

                    if (resData && resData.status.toLowerCase() === "completed") {
                        log.trace("Task completed:", taskId);
                        return resolve(resData);
                    }
                    setTimeout(next, delay);
                }, reject);
        }
        next();
    });
}



const pollTask = function createTask(requestObj, response) {
    return recursivePoll(3000, response.id)
        .then(taskResponse => {
            log.trace("Response returned from /task GET");
            return queue.responseHandler(requestObj, taskResponse);
        });
};


exports.pollTask = pollTask;
