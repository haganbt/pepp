"use strict";
const _ = require('underscore');
const config = require('config');

const taskHelper = require('./helpers/task');
const cacheHelper = require('./helpers/cache');
const log = require("./helpers/logger");


/**
 * buildRequest - process task config parameters
 * and generate a request object
 *
 * @param [{tasks}] - array of request objects
 * @param "type" - freqDist or timeSeries
 */
const buildRequest = function buildRequest(tasks, type) {

    let allRequests = [];
    let cacheId = cacheHelper.create();

    tasks.map(function(task){

        let reqObj = taskHelper.getDefault();

        //apply all task params to request
        reqObj.json.parameters.parameters = _.clone(task);
        reqObj.json.parameters.analysis_type = task.type || type;

        //apply auth and hash using "index" property
        reqObj = taskHelper.getIndexCreds(task, reqObj);

        //native nested
        reqObj = processNativeNested(task, reqObj);

        //custom nested - set next task
        if(_.has(task,'then')){
            reqObj.then = _.clone(task.then);
        }

        //filter
        if(_.has(task,'filter')){
            reqObj.json.filter = _.clone(task.filter);
        }

        //cache - merged
        if(tasks.length > 1){

            log.trace("Processing a merged task");

            if(_.has(task,'origCache')) {
                cacheId = cacheHelper.create(task.origCache + "-child");
                log.trace("Overwritten cacheId:", cacheId);
            }

            const mergeKey = _.has(task,'id') ? task.id : Math.random();

            //register the task in the cache
            cacheHelper.addKey(cacheId, mergeKey);

            //add signature to request task
            reqObj.cache = {
                "cacheId": cacheId,
                "mergeKey": mergeKey
            };

            log.trace("Attached cacheId to generated request:", cacheId);
        }

        //cleanup unsupported params from the request
        delete reqObj.json.parameters.parameters.then;
        delete reqObj.json.parameters.parameters.id;
        delete reqObj.json.parameters.parameters.filter;
        delete reqObj.json.parameters.parameters.type;

        delete reqObj.json.parameters.parameters.origCache;

        allRequests.push(reqObj);

    });

    log.debug("GENERATED REQUESTS:", JSON.stringify(allRequests, undefined, 4));
    return allRequests;
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

    let allTasks = [];
    //freqDist or TimeSeries
    for(let type in configObj){
        //tasks
        _.each(configObj[type], function (item) {

            //merged
            let taskArr = [];
            if (taskHelper.isValidKey(Object.keys(item)[0]) === false) {
                var p = Object.keys(item)[0];
                taskArr = extractTasks(item[p]);
            } else {
                //not merged
                taskArr = extractTasks(item);
            }

            allTasks.push(buildRequest(taskArr,type));
        });
    }
    return _.flatten(allTasks);
};

exports.loadConfigTasks = loadConfigTasks;
exports.buildRequest = buildRequest;
