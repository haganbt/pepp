"use strict";
process.env.NODE_ENV === undefined ? process.env.NODE_ENV = "demo" : "";

const _ = require('underscore');

const taskProcessor = require('./lib/taskProcessor');
const queue = require('./lib/queue');
const log = require("./lib/helpers/logger");
const cacheHelper = require('./lib/helpers/cache');
const format = require('./lib/format');

const configTasks = taskProcessor.loadConfigTasks();

configTasks.forEach(task => {
    queue.queueTask(task)
        .then(response => {

            //handle expected unresolved promises caused by recursion
            if(response === undefined || _.isEmpty(response)){
                return reject();
            }

            cacheHelper.debugAll();

            return response;

        })
        .then(response => {
            return format.jsonToCsv(response);
        })
        .then(response => {

            if(_.isObject(response)){
                log.info(JSON.stringify(response, undefined, 4));
            }

            if(_.isString(response)){
                log.info(response);
            }

        })
        .catch(err => {
            if(err.response.body){
                log.error(err.response.body);
            } else {
                log.error(JSON.stringify(err, undefined, 4));
            }
        });
});