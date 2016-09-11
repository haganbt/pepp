"use strict";

const Queue = require("promise-queue");
const config = require('config');
const _ = require('underscore');
const moment = require('moment');


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
 *
 * Pull results from different response formats
 *
 * @param api_resource - analyze or task
 * @param response - the response object
 * @returns {*}
 */
const normalizeResponse = function normalizeResponse(api_resource, response){

    switch (api_resource) {
        case "analyze":
            log.trace("Returning normalised result for /analyze", JSON.stringify(response.analysis.results, undefined, 4));
            return response.analysis.results;
        case "task":
            log.trace("Returning normalised result for /task", JSON.stringify(response.result.analysis.results, undefined, 4));
            return response.result.analysis.results;
    }
};


/**
 * @param {normalizedTask} - the normalizedTask obj that generated the response
 * @param {response} - the response obj from the request
 * @returns {*}
 */
const responseHandler = function(normalizedTask, response){
    let normalizedResponse;
    /****!!!
        This block will check to see if there is a custom tag
        */
        //log.trace("This is the normalizedTask:         ", normalizedTask);
    if(_.has(normalizedTask,'custom_tag')){
        log.trace("***Response Handler says- custom tag defined:         ", normalizedTask.custom_tag);
      //  requestParams.custom_tag = task.custom_tag;
        normalizedResponse = normalizedTask.custom_tag;

    } 
        /****!!!
        End custom tag handling block
        */ 
       
       //*****Need to add the else back in once request is stoped***
    else {   
    normalizedResponse = normalizeResponse(normalizedTask.api_resource, response);
        log.trace("***A normal response looks like:         ", normalizedResponse);
    }

    //log.trace("PROCESSING normalizedTask:", JSON.stringify(normalizedTask, undefined, 4));
    log.trace("PROCESSING RESPONSE:", JSON.stringify(normalizedResponse, undefined, 4));

    if (_.has(normalizedTask, 'then')) {

        let nextTasks = taskManager.buildNextTasks(normalizedTask, normalizedResponse);

        //Add new tasks to queue. Return a promise that will resolve
        //only once all the items in array have resolved.
        return Promise.all(nextTasks.map(function(each) {

            const requestObject = requestFactory(each);
            return queueRequest(requestObject, each);

        })).then(function(p){
            log.trace("Response handler returning with compact objects...");

            // remove undefined and nulls caused by unresolved
            // promises due to recursion
            return taskHelper.compact(p);
        });
    }

    //convert any timeSeries results from unix to human
    normalizedResponse = taskHelper.resUnixTsToHuman(normalizedTask.analysis_type, normalizedResponse);

    if (_.has(normalizedTask, 'cache')) {

        log.trace("Response requestObj has CACHE object");
        cacheHelper.addData(normalizedTask.cache.cacheId, normalizedTask.cache.mergeKey, normalizedResponse);

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
        return normalizedResponse;
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
    //check if we had a custom tag rather than actual request
    if(_.has(normalizedTask,'custom_tag')){
        log.debug("Building FILTER for freqDist using custom tag");
        console.log("not sending task - custom tags");
        return responseHandler(normalizedTask, normalizedTask.custom_tag);
    }
    else
    {    
        return queue.add(function () {
            console.log("sending task");
            return request.make(requestObj);
    
        }).then(response => {
    
            if(normalizedTask.api_resource === "analyze"){
    
                log.trace("Handling response from /analyze..");
    
                return responseHandler(normalizedTask, response);
    
            } else {
    
                log.trace("Polling for response from /task...");
    
                return request.recursivePoll(normalizedTask, requestObj, response);
    
            }
    
        }).catch(function (err) {
    
            if(err.error && err.error.error){
                log.error("MESSAGE:", err.error.error);
                log.error("CODE:", err.statusCode);
                log.error("TASK:", (err.normalizedTask) ? JSON.stringify(err.normalizedTask, undefined, 4) : JSON.stringify(normalizedTask, undefined, 4));
                log.error("REQUEST:", (err.request) ? JSON.stringify(err.request, undefined, 4) : JSON.stringify(requestObj, undefined, 4));
            } else {
                log.error(err);
            }
    
            //process.exit(1);
    
        });}
};

exports.queueRequest = queueRequest;
exports.responseHandler = responseHandler;
