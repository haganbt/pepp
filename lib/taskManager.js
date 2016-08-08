"use strict";
const _ = require('underscore');
const config = require('config');
const shortid = require('shortid');
const moment = require('moment');

const taskHelper = require('./helpers/task');
const requestFactory = require("./requestFactory").requestFactory;
const cacheHelper = require('./helpers/cache');
const log = require("./helpers/logger");
const operator = require("./helpers/operator");


/**
 * normalizeTask - takes each task object and build a normalized
 * key:value pair object. Any business logic should be done here.
 * The normalized object is then used to generate a request
 * object for the specific api resource (analyze or task) based
 * on the "api_resource" key.
 *
 * @param [{tasks}] - array of task objects from config
 * @param "analysis_type" - freqDist or timeSeries
 * @param "mergedName" - task name or undefined (if a merged task)
 * @param "globalFilter" - filter specified at global level - applied to all tasks
 *
 */
const normalizeTask = function normalizeTask(tasks, analysis_type, mergedName, globalFilter) {

    let allRequests = [];
    let cacheId = cacheHelper.create();

    tasks.map(function(task){

        let requestParams = {
            analysis_type: task.analysis_type || analysis_type,
            api_resource: config.get('app.api_resource')
        };

        if(_.has(task,'target')){
            requestParams.target = task.target;
        }

        if(_.has(task,'threshold')){
            requestParams.threshold = task.threshold;
        }

        if(_.has(task,'interval')){
            requestParams.interval = task.interval;
        }

        if(_.has(task,'span')){
            requestParams.span = task.span;
        }

        if(_.has(task,'start')){
            requestParams.start = task.start;
        }

        if(_.has(task,'end')){
            requestParams.end = task.end;
        }

        if(_.has(task,'index')){
            requestParams.index = task.index;
        }

        if(_.has(task,'api_resource')){
            requestParams.api_resource = task.api_resource;
        }

        requestParams.name = mergedName || task.name || taskHelper.generateName(task);

        if(globalFilter){
            requestParams.filter = "(" + globalFilter + ")";
        }

        if(_.has(task,'filter')){
            if(globalFilter){
                requestParams.filter += " AND (" + _.clone(task.filter) + ")";
            } else {
                requestParams.filter = "(" + _.clone(task.filter + ")");
            }
        }

        //native nested
        if(_.has(task,'child')){
            requestParams.child = {};
            requestParams.child.target = task.child.target;
            requestParams.child.threshold = task.child.threshold || undefined;

            if(task.child.child){
                requestParams.grandChild = {};
                requestParams.grandChild.target = task.child.child.target;
                requestParams.grandChild.threshold = task.child.child.threshold || undefined;
            }
        }

        //custom nested specific
        if(_.has(task,'then')){

            requestParams.then = _.clone(task.then);

            //inherit from parent task
            if(_.has(task,'index')){
                requestParams.then.index = task.index;
            }

            if(_.has(task,'start')){
                requestParams.then.start = task.start;
            }

            if(_.has(task,'end')){
                requestParams.then.end = task.end;
            }

            if(_.has(task,'api_resource')){
                requestParams.then.api_resource = task.api_resource;
            }

            if(_.has(task,'analysis_type')){
                requestParams.then.analysis_type = task.then.analysis_type
            } else {
                requestParams.then.analysis_type = analysis_type;
            }
        }

        //cache - merged
        if(tasks.length > 1){

            log.trace("Processing a merged task");

            const mergeKey = _.has(task,'id') ? task.id : shortid.generate();

            //register the task in the cache
            cacheHelper.addKey(cacheId, mergeKey);

            //add cache signature
            requestParams.cache = {
                "cacheId": cacheId,
                "mergeKey": mergeKey
            };

            log.trace("Attached cacheId to generated request:", cacheId);
        }

        allRequests.push(requestParams);

    });

    log.trace("All normalized objects:", allRequests);

    return allRequests;
};


/**
 * buildNextTasks - Generate an array of request
 * objects from a response result keys.
 *
 * @param {normalizedTask} - the normalizedTask obj that generated the response
 * @param {response} - the response obj from the request
 * @returns [{},{}] - array of request objects
 */
const buildNextTasks = function(normalizedTask, response){

    let nextTasks = [];

    log.trace("Building next with normalizedTask:", JSON.stringify(normalizedTask, undefined, 4));
    //log.trace("Building next with response:", JSON.stringify(response, undefined, 4));








    response.analysis.results.map(result => {


        let nextTask = _.clone(normalizedTask.then);


        let analysisType = nextTask.analysis_type;

        //FREQDIST responses - build next FILTER from result key
        if(analysisType === 'freqDist') {
            log.debug("Building FILTER for freqDist");

            //append cascading filter
            nextTask.filter = "(" + response.analysis.parameters.target + " "
                + operator.get(response.analysis.parameters.target) + " \"" + result.key + "\")";

            //parent task had a filter, append
            if (_.has(normalizedTask.json, "filter")) {
                nextTask.filter += " AND (" + normalizedTask.json.filter + ")";
            }

            //child normalizedTask had a filter, append
            if (_.has(normalizedTask.then, "filter")) {
                nextTask.filter += " AND (" + normalizedTask.then.filter + ")";
            }

            //set task id from response result key and inherit
            //any id value set in the config
            nextTask.id = _.has(normalizedTask, 'cache') ? normalizedTask.cache.mergeKey + "__" + result.key : result.key;
        }

        // TIMESERIES responses - build next filter START, END from result key
        if(analysisType === 'timeSeries'){
            log.debug("Building START & END for timeSeries");

            let endOverride = taskHelper.getEndTs(result.key, response.analysis.parameters.interval);

            //parent task had a filter, append
            if (_.has(normalizedTask.json, "filter"))
                nextTask.filter = "(" + normalizedTask.json.filter + ")";

            //child task had a filter, append
            if (_.has(normalizedTask.then, "filter")) {
                nextTask.filter += " AND (" + task.then.filter + ")";
            }

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
            nextTask.id = _.has(normalizedTask, 'cache') ? normalizedTask.cache.mergeKey + "__"
            + taskHelper.unixToHuman(result.key) : taskHelper.unixToHuman(result.key);
        }

        if (_.has(normalizedTask, 'then') && _.has(normalizedTask, 'cache')){
            nextTask.cache.cacheId = _.clone(normalizedTask.cache.cacheId);
        }


        nextTasks.push(nextTask);
    });

    log.trace("Next tasks built:", JSON.stringify(nextTasks, undefined, 4));

    //return normalizeTask(nextTasks, "freqDist");
    return nextTasks;
};


/**
 * extractTasks - helper method to extract
 * each set of tasks from an object
 *
 * @param inObj
 * @returns {Array}
 */
const extractTasks = function extractTasks(inObj){
    let tasks = [];
    if (_.isArray(inObj)){
        for(let idx in inObj){
            tasks.push(inObj[idx]);
        }
    } else {
        tasks.push(inObj);
    }
    return tasks;
};


/**
 * loadConfigTasks - parse the config file and build a normalized task object for each.
 *
 * @param {configTest} - optional config task for
 * testing, otherwise loaded from config file
 *
 * @return [{tasks}] - array of request objects
 */
const loadConfigTasks = function loadConfigTasks(configTest) {

    let configObj = configTest || config.get('analysis');
    let globalFilter = (config.has('filter') ? config.get('filter') : undefined);

    let allNormalizedTasks = [];
    let mergedName;

    //freqDist or TimeSeries
    for(let analysis_type in configObj){

        //tasks
        _.each(configObj[analysis_type], function (item) {
            //merged
            let taskArr = [];
            if (taskHelper.isValidKey(Object.keys(item)[0]) === false) {
                let key = Object.keys(item)[0];
                mergedName = key; //set name if merged task
                taskArr = extractTasks(item[key]);
            } else {
                //not merged
                taskArr = extractTasks(item);
            }

            const normalizedTask = normalizeTask(taskArr, analysis_type, mergedName, globalFilter);

            allNormalizedTasks.push(normalizedTask);

            mergedName = undefined; // reset if set
        });

    }

    return _.flatten(allNormalizedTasks);;

};


/**
 * buildRequests - from an anrray or normalized tasks
 *
 * @param normalizedTasks
 * @returns {Array}

const buildRequests = function buildRequests(normalizedTasks){

    const allRequestObjects = [];

    _.each(normalizedTasks, function (nTask) {

        const requestObject = requestFactory(nTask);
        allRequestObjects.push(requestObject);

        log.trace("Built request:", requestObject);

    });

    return allRequestObjects;
};
 */

exports.loadConfigTasks = loadConfigTasks;
exports.buildNextTasks = buildNextTasks;
exports.normalizeTask = normalizeTask;
//exports.buildRequests = buildRequests;