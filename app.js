"use strict";
process.env.NODE_ENV === undefined ? process.env.NODE_ENV = "demo" : "";

const taskProcessor = require('./lib/taskProcessor');
const queue = require('./lib/queue');

const configTasks = taskProcessor.loadConfigTasks();

log(configTasks);
/*
configTasks.forEach(task => {
    queue.queueTask(task)
        .then(response => {
            //log(task);
            if(response){
                console.log(response);
            }

        })
        .catch(err => {
            log(err.statusCode);
            log(err.response.body);
            log(err);
        });
})
*/
function log(data) {
    console.log(JSON.stringify(data, undefined, 4));
}
