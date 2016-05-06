"use strict";

const Queue = require("promise-queue");
const config = require('config');
const _ = require('underscore');
const moment = require('moment');

const cacheHelper = require('./helpers/cache');
const request = require('./request');
const taskProcessor = require('./taskProcessor');
const taskHelper = require('./helpers/task');
const log = require("./helpers/logger");
const operator = require("./helpers/operator");

const maxConcurrent = process.env.MAX_PARALLEL_TASKS ||
    (config.has('app.max_parallel_tasks') ? config.get('app.max_parallel_tasks') : 3);

const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);

let reqCount = 0;
let resCount = 0;

/**
 * @param {task}
 * @param {response}
 * @returns {*}
 */
const responseHandler = function(task, response){
    log.debug("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));

    if (_.has(task, 'then')) {

        let nextTasks = buildNextTasks(task, response);

        //Add new tasks to queue. Return a promise that will resolve
        //only once all the items in array have resolved.
        return Promise.all(nextTasks.map(function(each) {
            return queueTask(each);
        })).then(function(p){
            log.trace("Response handler returning with compact objects...");

            // remove undefined and nulls caused by unresolved
            // promises due to recursion
            return taskHelper.compact(p);
        });
    }


    //convert any timeSeries results from unix to human
    response = taskHelper.resUnixTsToHuman(response);


    if (_.has(task, 'cache')) {
        log.trace("Response task has CACHE object");

        cacheHelper.addData(task.cache.cacheId, task.cache.mergeKey, response.analysis.results);

        let cacheData = cacheHelper.get(task.cache.cacheId);
        if (cacheData.remainingTasks === 0) {
            log.trace("Response handler returning with remaining tasks = 0...");

            delete cacheData.remainingTasks;
            return [cacheData]; //format as array of objects for csv parser

        } else {
            log.trace("Response handler returning with remaining tasks > 0...");

            return;
        }
    }


    if (_.has(task, 'then') === false && _.has(task, 'cache') === false) {
        log.trace("Response handler returning with no THEN or CACHE objects...");

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

    let nextTasks = [];

    log.trace("Building next task from THEN object:", JSON.stringify(task.then, undefined, 4));

    response.analysis.results.map(result => {

        let nextTask = _.clone(task.then);
        let analysisType = response.analysis.analysis_type;

        //FREQDIST responses - build next FILTER from result key
        if(analysisType === 'freqDist') {
            log.debug("Building FILTER for freqDist");

            nextTask.filter = "(" + response.analysis.parameters.target + " "
                + operator.get(response.analysis.parameters.target) + " \"" + result.key + "\")";

            //append cascading filter
            if (_.has(task.json, "filter"))
                nextTask.filter += " AND " + task.json.filter;

            //set task id from response result key and inherit
            //any id value set in the config
            nextTask.id = _.has(task, 'cache') ? task.cache.mergeKey + "__" + result.key : result.key;
        }

        // TIMESERIES responses - build next filter START, END from result key
        if(analysisType === 'timeSeries'){
            log.debug("Building START & END for timeSeries");

            let endOverride = taskHelper.getEndTs(result.key, response.analysis.parameters.interval);

            //only override the start if its less than 32 days as timeSeries can
            //return an interval start outside of the max period. If that happens
            //the default obj value will be used ie now - 32 days
            if(result.key > moment.utc().subtract(32, 'days').unix()){
                nextTask.start = result.key;
            }
            nextTask.end = endOverride;

            log.trace("Generated start: " + nextTask.start + " "
                + moment.unix(nextTask.start).utc().format("DD-MMM h:mm:ss a"));

            log.trace("Generated end:   " + nextTask.end + " "
                + moment.unix(nextTask.end).utc().format("DD-MMM h:mm:ss a"));

            //set task id from response result key and inherit
            //any id value set in the config
            nextTask.id = _.has(task, 'cache') ? task.cache.mergeKey + "__"
                + taskHelper.unixToHuman(result.key) : taskHelper.unixToHuman(result.key);
        }

        if (_.has(task, 'then') && _.has(task, 'cache'))
            nextTask.parentCache = _.clone(task.cache.cacheId);

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

        if(process.env.NODE_ENV !== "test"){
            reqCount ++;
            log.info("--> " + resCount + "/" + reqCount);
        }

        return request.make(task);
    }).then(response => {

        if(process.env.NODE_ENV !== "test") {
            resCount++;
            log.info("<-- " + resCount + "/" + reqCount);
        }

        return response;
    }).then(response => {
        return responseHandler(task, response);
    }).catch(function (err) {
        if (err.error && err.error.error) {
            log.error(JSON.stringify(err.error.error, undefined, 4));
        } else {
            log.error(JSON.stringify(err, undefined, 4));
        }
        process.exit(1);
    });
};

exports.queueTask = queueTask;
