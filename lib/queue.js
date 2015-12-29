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
 * @param {task}
 * @param {response}
 * @returns {*}
 */
const processResponse = function(task, response){

    log.debug("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));

    if (_.has(task, 'then')) {

        let nextTasks = buildNextTasks(task, response);

        //Add new tasks to queue. Return a promise that will resolve
        //only once all the items in array have resolved.
        return when.all(nextTasks.map(function(each) {
            return queueTask(each);
        }));
    }

    if (_.has(task, 'cache')) {

        log.trace("Response task has CACHE object");

        cacheHelper.addData(task.cache.cacheId, task.cache.mergeKey, response.analysis.results);

        let cacheData = cacheHelper.get(task.cache.cacheId);

        if (cacheData.remainingTasks === 0) {
            delete cacheData.remainingTasks;
            log.error("Remaining tasks = 0, returning");
            return cacheData;
        }
    }

    if (_.has(task, 'then') === false && _.has(task, 'cache') === false) {
        log.error("Response task has no THEN and no CACHE objects");
        return response.analysis.results;
    }
};


/**
 * Generate an array of request objects from a response result keys.
 *
 * @param task
 * @param response
 * @returns [{},{}] - array of request objects
 */
const buildNextTasks = function(task, response){

    log.trace("Building next task from THEN object:", JSON.stringify(task.then, undefined, 4));

    let nextTasks = [];

    //generate filter and id params from response result keys
    response.analysis.results.map(result => {
        var nextTask = _.clone(task.then);

        //build next filter from result key
        nextTask.filter = "(" + response.analysis.parameters.target + " "
            + operator.get(response.analysis.parameters.target) + " \"" + result.key + "\")";

        //append cascading filter
        if(_.has(task.json, "filter"))
            nextTask.filter += " AND " + task.json.filter;

        //TODO
        if (_.has(task, 'then') && _.has(task, 'cache'))
            nextTask.origCache = _.clone(task.cache.cacheId);

        //set task id from response result key
        nextTask.id = result.key;
        nextTasks.push(nextTask);
    });

    return taskProcessor.buildRequest(nextTasks, "freqDist");
};


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
        return processResponse(task, response);
    }).catch(function (err) {
        if (err.error && err.error.error) {
            log.error(JSON.stringify(err.error.error, undefined, 4));
        } else {
            log.error(JSON.stringify(err, undefined, 4));
        }
    });
};

exports.queueTask = queueTask;
