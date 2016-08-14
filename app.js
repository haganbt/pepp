"use strict";
process.env.NODE_ENV === undefined ? process.env.NODE_ENV = "demo" : "";

const _ = require('underscore');
const figlet = require('figlet');

const taskManager = require('./lib/taskManager');
const queue = require('./lib/queue');
const log = require("./lib/helpers/logger");
const cacheHelper = require('./lib/helpers/cache');
const format = require('./lib/format');
const baseline = require('./lib/baseline');
const file = require('./lib/file');
const requestFactory = require("./lib/requestFactory").requestFactory;



const normalizedTasks = taskManager.loadConfigTasks();

//let allRequests = taskManager.buildRequests(configTasks);

log.info(figlet.textSync(process.env.NODE_ENV));
console.log("\n\n");

normalizedTasks.forEach(task => {

    //build a request
    const reqObj = requestFactory(task);

    // queue request and api (task or analyze)
    queue.queueRequest(reqObj, task)
        .then(response => {

            //handle expected unresolved promises caused by recursion
            if(response === undefined || _.isEmpty(response)){
                return reject();
            }

            cacheHelper.debugAll();

            return response;
        })
        .then(response => {

            if(reqObj.name.includes('baseline')) {
                return baseline.gen(response, reqObj);
            } else {
                return format.jsonToCsv(response);
            }

        })
        .then(response => {
            return file.write(reqObj.name, response);
        })
        .then(response => {

            if(_.isObject(response)){
                log.info(JSON.stringify(response, undefined, 4));
            }

            if(_.isString(response)){
                log.info(response);
            }
            console.log("\n");

        })
        .catch(err => {
            if(err.response.body){
                log.error(err.response.body);
            } else {
                log.error(JSON.stringify(err, undefined, 4));
            }
            process.exit(1);
        });
});