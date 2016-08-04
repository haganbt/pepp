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
 * buildRequest - takes each task object and builds a normalized
 * key:value pair object. Any business logic should be done here.
 * The normalized object is then used to generate a request
 * object for the specific api resource (analyze or task)
 *
 * @param [{tasks}] - array of task objects from config
 * @param "analysis_type" - freqDist or timeSeries
 * @param "mergedName" - task name or undefined (if a merged task)
 * @param "globalFilter" - filter specified at global level - applied to all tasks
 *
 */
const buildRequest = function buildRequest(tasks, analysis_type, mergedName, globalFilter) {

    let allRequests = [];
    let cacheId = cacheHelper.create();

    tasks.map(function(task){

        let requestParams = {
            analysis_type: task.type || analysis_type
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

        let requestObject = requestFactory(requestParams).analyze();

        //console.log(JSON.stringify(requestObject, undefined, 4));

        allRequests.push(requestObject);
    });

    log.trace("Generated tasks:", JSON.stringify(allRequests, undefined, 4));

    return allRequests;
};



/**
 * buildNextTasks - Generate an array of request
 * objects from a response result keys.
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

            //append cascading filter
            nextTask.filter = "(" + response.analysis.parameters.target + " "
                + operator.get(response.analysis.parameters.target) + " \"" + result.key + "\")";

            //parent task had a filter, append
            if (_.has(task.json, "filter")) {
                nextTask.filter += " AND (" + task.json.filter + ")";
            }

            //child task had a filter, append
            if (_.has(task.then, "filter")) {
                nextTask.filter += " AND (" + task.then.filter + ")";
            }

            //set task id from response result key and inherit
            //any id value set in the config
            nextTask.id = _.has(task, 'cache') ? task.cache.mergeKey + "__" + result.key : result.key;
        }

        // TIMESERIES responses - build next filter START, END from result key
        if(analysisType === 'timeSeries'){
            log.debug("Building START & END for timeSeries");

            let endOverride = taskHelper.getEndTs(result.key, response.analysis.parameters.interval);

            //parent task had a filter, append
            if (_.has(task.json, "filter"))
                nextTask.filter = "(" + task.json.filter + ")";

            //child task had a filter, append
            if (_.has(task.then, "filter")) {
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
            nextTask.id = _.has(task, 'cache') ? task.cache.mergeKey + "__"
            + taskHelper.unixToHuman(result.key) : taskHelper.unixToHuman(result.key);
        }

        if (_.has(task, 'then') && _.has(task, 'cache'))
            nextTask.parentCache = _.clone(task.cache.cacheId);

        nextTasks.push(nextTask);
    });

    return buildRequest(nextTasks, "freqDist");
};



/**
 * processNativeNested - correctly format any native
 * nested config that has been applied to the
 * request object being built.
 *
 * @param {taskObj} - the task containing native
 * nested config. Note this is simply used for brevity
 * as the {reqObj} has already had the task
 * applied and could be accessed there.
 * @param reqObj - request object being built
 *
 * @returns {reqObj}
 */
const processNativeNested = function processNativeNested(taskObj, reqObj){
    if (taskObj.child){

        //child
        reqObj.json.parameters.child = {
            "analysis_type": "freqDist", //eslint-disable-line
            "parameters": taskObj.child
        };

        //grandchild
        if(taskObj.child.child){
            reqObj.json.parameters.child.child = {
                "analysis_type": "freqDist", //eslint-disable-line
                "parameters": taskObj.child.child
            };
        }

        delete reqObj.json.parameters.parameters.child.child;
        delete reqObj.json.parameters.parameters.child;
    }
    return reqObj;
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
 * loadConfigTasks - iterate the config file calling
 * buildRequest() for each.
 *
 * @param {configTest} - optional config task for
 * testing, otherwise loaded from config file
 *
 * @return [{tasks}] - array of request objects
 */
const loadConfigTasks = function loadConfigTasks(configTest) {

    let configObj = configTest || config.get('analysis');
    let globalFilter = (config.has('filter') ? config.get('filter') : undefined);
;
    let allTasks = [];
    let mergedName;
    
    //freqDist or TimeSeries
    for(let type in configObj){

        //tasks
        _.each(configObj[type], function (item) {
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

            allTasks.push(buildRequest(taskArr,type, mergedName, globalFilter));

            mergedName = undefined; // reset if set
        });

    }
    return _.flatten(allTasks);
};

exports.loadConfigTasks = loadConfigTasks;
exports.buildNextTasks = buildNextTasks;
exports.buildRequest = buildRequest;
