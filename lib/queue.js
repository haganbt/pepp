"use strict";

const Queue = require("promise-queue");
const config = require('config');
const _ = require('underscore');
const moment = require('moment');
const pace = require('pace')(1);

const cacheHelper = require('./helpers/cache');
const request = require('./request');
const taskManager = require('./taskManager');
const taskHelper = require('./helpers/task');
const log = require("./helpers/logger");
const requestFactory = require("./requestFactory").requestFactory;

const maxConcurrent = process.env.MAX_PARALLEL_TASKS ||
    (config.has('app.max_parallel_tasks') ? config.get('app.max_parallel_tasks') : 3);
const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);



/**
 * @param {normalizedTask} - the normalizedTask obj that generated the response
 * @param {response} - the response obj from the request
 * @returns {*}
 */
const responseHandler = function(normalizedTask, response){

    cacheHelper.debugAll();

    console.log("----------------------------------------------");

    console.log("responseHandler called with normalizedTask:" , JSON.stringify(normalizedTask, undefined, 4));

    console.log("responseHandler called with response:" , JSON.stringify(response, undefined, 4));

    console.log("----------------------------------------------");

    if (_.has(normalizedTask, 'then')) {




        let nextTasks = taskManager.buildNextTasks(normalizedTask, response);
        delete normalizedTask.then;
        //Add new tasks to queue. Return a promise that will resolve
        //only once all the items in array have resolved.
        return Promise.all(nextTasks.map(function(each) {

            //todo - generate request and add to queue should be a reusable function
            const requestObject = requestFactory(each);
            return queueRequest(requestObject, normalizedTask);

        })).then(function(p){
            log.trace("Response handler returning with compact objects...");

            // remove undefined and nulls caused by unresolved
            // promises due to recursion
            return taskHelper.compact(p);
        });
    }

    //convert any timeSeries results from unix to human
    response = taskHelper.resUnixTsToHuman(response);



    if (_.has(normalizedTask, 'cache')) {
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        log.trace("normalizedTask has CACHE object");
        cacheHelper.addData(normalizedTask.cache.cacheId, normalizedTask.cache.mergeKey, response.analysis.results);



        let cacheData = cacheHelper.get(normalizedTask.cache.cacheId);

        if (cacheData.remainingTasks === 0) {
            log.trace("Response handler returning with remaining tasks = 0...");

            delete cacheData.remainingTasks;
            return [cacheData]; //format as array of objects for csv parser

        } else {
            log.trace("Response handler returning with remaining tasks > 0...");
            return;
        }
    }


    if (_.has(normalizedTask, 'then') === false && _.has(normalizedTask, 'cache') === false) {
        log.trace("Response handler returning with no THEN or CACHE objects...");

        return response.analysis.results;
        //return response.result.analysis.results;
    }
};


/**
 * queueRequest - add request obj to queue and pass
 * the results to the responseHandler()
 *
 * @param requestObj - a request object
 * @returns {LocalPromise}
 */
const queueRequest = function queueRequest(requestObj, normalizedTask) {
    return queue.add(function () {


        return request.make(requestObj);
    }).then(response => {


        return response;
    }).then(response => {


        console.log("=== ", normalizedTask, "\n\n");

        //if(normalizedTask.api_resource === "analyze"){
           // log.trace("Handling analyze response..");
            return responseHandler(normalizedTask, response);
       // } else {
       //     log.trace("Polling for response..");
       //     return request.recursivePoll(requestObj, response);
      //  }


    }).catch(function (err) {

        if(err.error && err.error.error){
            log.error(err.statusCode, JSON.stringify(err.error.error, undefined, 4));
        } else {
            log.error(err);
        }

        process.exit(1);
    });
};

exports.queueRequest = queueRequest;
exports.responseHandler = responseHandler;