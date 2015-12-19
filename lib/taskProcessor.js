"use strict";
const _ = require('underscore');
const config = require('config');

const taskHelper = require('./helpers/task');
const cacheHelper = require('./helpers/cache');

const configObj = config.get('analysis');


/**
 * process - generates a request task object merging
 * the config parameters.
 *
 * @param [{tasks}] - array of task objects
 * @param "type" - freqDist or timeSeries
 */
function process(tasks,type){

    let allTasks = [];
    let cacheId = cacheHelper.create();

    for(let eachTask in tasks){

        let reqObj = taskHelper.getDefault();

        //apply task params to req obj
        reqObj.json.parameters.parameters = tasks[eachTask];
        reqObj.json.parameters.analysis_type = type;

        //auth and hash
        reqObj = taskHelper.getIndexCreds(tasks[eachTask], reqObj);

        //native nested
        reqObj = processNativeNested(tasks[eachTask], reqObj);

        //merged tasks
        if(tasks.length > 1){

            let mergeKey = eachTask; //TODO

            //register the task in the cacheHelper
            cacheHelper.addKey(cacheId, mergeKey);

            //add signature to request task
            reqObj.cache = {
                "cacheId": cacheId,
                "mergeKey": mergeKey
            };
        }
        allTasks.push(reqObj);
    }
    //log(allTasks);
    return allTasks;
}


/**
 * processNativeNested - correctly format any native
 * nested config that has been applied to the
 * request object being built.
 *
 * @param {configObj} - the task containing native
 * nested config. Note this is simply used for brevity
 * as the {reqObj} has already had the task
 * applied and could be accessed there.
 * @param reqObj - request object being built
 * @returns {reqObj}
 */
function processNativeNested(configObj, reqObj){
    if(configObj.child){
        //child
        reqObj.json.child = {
            "analysis_type": "freqDist",
            "parameters": configObj.child
        };
        //grandchild
        if(configObj.child.child){
            reqObj.json.child.child = {
                "analysis_type": "freqDist",
                "parameters": configObj.child.child
            };
        }
        delete reqObj.json.parameters.child;
        delete reqObj.json.child.parameters.child;
        delete reqObj.json.parameters.parameters.child;
    }
    return reqObj;
}


/**
 * extractTasks - helper method to extract
 * each set of tasks from an object
 *
 * @param inObj
 * @returns {Array}
 */
function extractTasks(inObj){
    let tasks = [];
    if(_.isArray(inObj)){
        for(let idx in inObj){
            tasks.push(inObj[idx]);
        }
    } else {
        tasks.push(inObj);
    }
    return tasks;
}


/**
 * loadConfigTasks - iterate the config file
 *
 * @return [{tasks}] - array of task objects
 */
exports.loadConfigTasks = function loadConfigTasks() {
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

            allTasks.push(process(taskArr,type));
        });
    }
    return _.flatten(allTasks);
};


function log(data){
    console.log(JSON.stringify(data, undefined, 4));
}