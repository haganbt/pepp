"use strict";
process.env.NODE_ENV === undefined ? process.env.NODE_ENV = "demo" : "";

const _ = require('underscore');

const taskProcessor = require('./lib/taskProcessor');
const queue = require('./lib/queue');
const log = require("./lib/helpers/logger");
const taskHelper = require('./lib/helpers/task');
const cacheHelper = require('./lib/helpers/cache');

const configTasks = taskProcessor.loadConfigTasks();

configTasks.forEach(task => {
    queue.queueTask(task)

        .then(response => {

            //Remove expected "undefined" values for
            //unresolved promises caused by recursion
            return taskHelper.compact(response);

        })
        .then(response => {

            log.info("===================== FINAL RESPONSE ===========================");
            log.info(JSON.stringify(taskHelper.compact(response), undefined, 4));
            cacheHelper.debugAll();

        })
        .catch(err => {
            if(err.response.body){
                log.error(err.response.body);
            } else {
                log.error(JSON.stringify(err, undefined, 4));
            }
        });
});