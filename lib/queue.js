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

let reqCount = 0;
let resCount = 0;

/**
 * @param {requestObj} - the request obj that generated the response
 * @param {response} - the response obj from the request
 * @returns {*}
 */
const responseHandler = function(requestObj, response){

    log.trace("PROCESSING RESPONSE:", JSON.stringify(response, undefined, 4));

    if (_.has(requestObj, 'then')) {

        let nextTasks = taskManager.buildNextTasks(requestObj, response);

        //Add new tasks to queue. Return a promise that will resolve
        //only once all the items in array have resolved.
        return Promise.all(nextTasks.map(function(each) {

            //todo - generate request and add to queue should be a reusable function
            const requestObject = requestFactory(each);
            return queueRequest(requestObject);

        })).then(function(p){
            log.trace("Response handler returning with compact objects...");

            // remove undefined and nulls caused by unresolved
            // promises due to recursion
            return taskHelper.compact(p);
        });
    }

    //convert any timeSeries results from unix to human
    response = taskHelper.resUnixTsToHuman(response);

    if (_.has(requestObj, 'cache')) {

        log.trace("Response requestObj has CACHE object");
        cacheHelper.addData(requestObj.cache.cacheId, requestObj.cache.mergeKey, response.analysis.results);

        let cacheData = cacheHelper.get(requestObj.cache.cacheId);

        if (cacheData.remainingTasks === 0) {
            log.trace("Response handler returning with remaining tasks = 0...");

            delete cacheData.remainingTasks;
            return [cacheData]; //format as array of objects for csv parser

        } else {
            log.trace("Response handler returning with remaining tasks > 0...");
            return;
        }
    }


    if (_.has(requestObj, 'then') === false && _.has(requestObj, 'cache') === false) {
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
const queueRequest = function queueRequest(requestObj) {
    return queue.add(function () {

        if(process.env.NODE_ENV !== "test"){
            reqCount ++;
            pace.total = reqCount;
        }

        return request.make(requestObj);
    }).then(response => {

        if(process.env.NODE_ENV !== "test") {
            resCount++;
            pace.op(resCount);
        }

        return response;
    }).then(response => {

        //todo - handle async
        return responseHandler(requestObj, response);

        //return request.recursivePoll(requestObj, response);

    }).catch(function (err) {

        log.error(err);

        process.exit(1);
    });
};

exports.queueRequest = queueRequest;
exports.responseHandler = responseHandler;