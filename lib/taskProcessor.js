"use strict";
const _ = require('underscore');
const config = require('config');

const taskHelper = require('./helpers/task');
const cache = require('./helpers/cache');

const configObj = config.get('analysis');


/**
 * process - generates a request task object merging
 * the config parameters.
 *
 * @param [{tasks}] - array of task objects
 * @param "type" - freqDist or timeSeries
 */
function process(tasks,type){

    let defaultTask = taskHelper.getDefault();
    let allTasks = [];

    //Add cache signature to merged tasks
    if(tasks.length > 1){
        defaultTask.cache = {
            "cacheId": cache.create(),
            "mergeKey": new Date() //TODO
        };
    }

    for(let eachTask in tasks){

        //apply task params to req obj
        defaultTask.json.parameters = tasks[eachTask];
        defaultTask.json.parameters.analysis_type = type;

        //native nested
        defaultTask = processNativeNested(tasks[eachTask], defaultTask);

        allTasks.push(defaultTask);
    }

    log(allTasks);
    return allTasks;
}


/**
 * processNativeNested - takes each config task and
 * processes any native nested tasks.
 *
 * @param {configObj} config parameters
 * @param {defaultTask} request object being built
 * @returns {defaultTask}
 */
function processNativeNested(configObj, defaultTask){
    if(configObj.child){
        //child
        defaultTask.json.child = {
            "analysis_type": "freqDist",
            "parameters": configObj.child
        };
        //grandchild
        if(configObj.child.child){
            defaultTask.json.child.child = {
                "analysis_type": "freqDist",
                "parameters": configObj.child.child
            };
            delete defaultTask.json.child.parameters.child;
        }
        delete defaultTask.json.parameters.child;
    }
    return defaultTask;
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

    return allTasks;
}


function log(data){
    console.log(JSON.stringify(data, undefined, 4));
}