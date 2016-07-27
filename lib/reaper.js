"use strict";

const HashMap = require('hashmap');

const log = require("./helpers/logger");
const request = require('./request');
const queue = require('./queue');

const uri = "http://api-linkedin-prod.devms.net/v1.4/pylon/linkedin/task/";

var options = {
    headers: {
        'Authorization': ""
    },
    json: true // Automatically parses the JSON string in the response
};

let requestIds = [];
let status = "stopped";
let map = new HashMap();


const handleData = function handleData(id, data) {
    console.log("DATA RETURNED");

    //load the original request object
    let taskReqObj = map.get(id);

    console.log("Calling responseHandler with ", taskReqObj);

    queue.responseHandler(taskReqObj, data);

    //console.log(JSON.stringify(data, undefined, 4));
};


function processLoop(delay) {
    return new Promise(function(resolve, reject) {
        status = "running";
        function next() {
            console.log("Queue length:", requestIds.length, requestIds);

            if(requestIds.length === 0){
                status = "stopped";
                resolve("done");
            } else {
                options.uri = uri + requestIds[0];
                console.log("making request for ", requestIds[0]);

                request.make(options)
                    .then(function(resData) {

                        console.log("Status of task: ", resData.status, requestIds[0]);

                        if (resData && resData.status.toLowerCase() === "completed") {

                            requestIds.shift(); // drop the id from the array queue
                            console.log("Queue length:", requestIds.length, requestIds);
                            handleData(requestIds[0], resData);
                        }
                        // run another iteration of the loop after delay
                        setTimeout(next, delay);
                    }, reject);
            }
        }
        // start first iteration of the loop
        next();
    });
}




const createTask = function createTask(requestObj, response) {

    if(!response.id){
        log.error("Task API collector expects a response.id. Killing process.");
        process.exist(0);
    }

    // Save the requestObj so that we can return it with
    // the result set for processing
    map.set(response.id, requestObj);

    requestIds.push(response.id);

    console.log("Added ", response.id, " to queue");

    if(status === "stopped"){

        console.log("Polling started...");

        processLoop(5000).then(function(results) {

            console.log("Task poling complete.");

        }, function(err) {
            log.error(err);
        });
    }



};


exports.createTask = createTask;
