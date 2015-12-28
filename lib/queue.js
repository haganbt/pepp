"use strict";

const Queue = require("promise-queue");
const config = require('config');
const _ = require('underscore');
const when = require('when');

const cacheHelper = require('./helpers/cache');
const request = require('./request');
const taskProcessor = require('./taskProcessor');
const log = require("./helpers/logger");
const operator = require("./helpers/operator");

const maxConcurrent = process.env.MAX_PARALLEL_TASKS ||
    (config.has('app.max_parallel_tasks') ? config.get('app.max_parallel_tasks') : 3);

const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);


/**
 * queueTask - add task to queue
 *
 * @param task
 * @returns {LocalPromise}
 */
const queueTask = function queueTask(task) {
    return queue.add(function () {
        return request.make(task);
    }).then(response => {

        log.debug("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));


        if (_.has(task, 'then')) {
            //log.trace("Building request from THEN task:", task.then);
            log.trace("Task has THEN object");
            let nextTasks = [];

            //build a "filter" property from each result key
            response.analysis.results.map(result => {
                var nextTask = _.clone(task.then);

                if (_.has(task, 'then') && _.has(task, 'cache')) {
                    nextTask.origCache = _.clone(task.cache.cacheId);
                }

                nextTask.filter = response.analysis.parameters.target + " "
                    + operator.get(response.analysis.parameters.target) + " \"" + result.key + "\"";

                nextTask.id = result.key;

                nextTasks.push(nextTask);
            });

            let taskConfigs = taskProcessor.buildRequest(nextTasks, "freqDist");

            //Add new tasks to queue. Return a promise that will resolve
            //only once all the items in array have resolved.
            return when.all(taskConfigs.map(function(each) {
                return queueTask(each);
            }));
        }

        if (_.has(task, 'cache')) {
            log.trace("Response task has CACHE object");
            cacheHelper.addData(task.cache.cacheId, task.cache.mergeKey, response.analysis.results);

            let cacheData = cacheHelper.get(task.cache.cacheId);

            if (cacheData.remainingTasks === 0) {
                delete cacheData.remainingTasks;
                log.trace("Returning as remaining tasks = 0");
                return cacheData;
            }
        }


        if (_.has(task, 'then') === false && _.has(task, 'cache') === false) {
            log.trace("Response task has no THEN and no CACHE objects");
            log.trace("Returning response");
            return response.analysis.results;
        }


        //log.trace("Returning response catch all:");
        //return response.analysis.results;


    }).catch(function (err) {
        if (err.error && err.error.error) {
            log.error(JSON.stringify(err.error.error, undefined, 4));
        } else {
            log.error(JSON.stringify(err, undefined, 4));
        }
    });
};

exports.queueTask = queueTask;