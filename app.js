"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || "demo";

const _ = require('underscore');
const figlet = require('figlet');
const bytes = require('bytes');
const plugins = require('require-all')(__dirname + '/plugins');

var waterfall = require("promise-waterfall");

const taskManager = require('./lib/taskManager');
const queue = require('./lib/queue');
const log = require("./lib/helpers/logger");
const requestStats = require("./lib/helpers/requestStats");
const cacheHelper = require('./lib/helpers/cache');
const format = require('./lib/format');
const baseline = require('./lib/baseline');
const file = require('./lib/file');
const requestFactory = require("./lib/requestFactory").requestFactory;
const spinner = require("./lib/helpers/spinner");


spinner.start();
log.info(figlet.textSync(process.env.NODE_ENV));
console.log("\n\n");

const normalizedTasks = taskManager.loadConfigTasks();


function promiseWaterfall(tasks) {
    let finalTaskPromise = tasks.reduce(function(prevTaskPromise, task) {
        return prevTaskPromise.then(task);
    }, resolvedPromise);  // initial value

    return finalTaskPromise;
}




normalizedTasks.forEach(task => {

    const reqObj = requestFactory(task);

    queue.queueRequest(reqObj, task)
        .then(response => {

            //handle expected unresolved promises caused by recursion
            if(response === undefined || _.isEmpty(response)){
                return;
            }

            cacheHelper.debugAll();




            return Object.keys(plugins).map(function(key) {
                //p.push();


                return plugins[key](response);





            });


            //return waterfall(p)


            // the promiseSequence will executes sequentially
            // just like func1().then(func2).then(func3)




//            return promiseWaterfall(pluginPromises);


/*
            return Promise.all(pluginPromises).then(function(results) {
                return results.map(function(item) {
                    // can return either a value or another promise here
                    console.log(item);
                    console.log(typeof(item));
                    return new Promise(resolve(item));
                });
            })

*/

        })
        .then(function(response) {




            log.info("**************** "+response);



            if(reqObj.name.includes('baseline')) {
                return baseline.gen(response, reqObj);
            } else {
                return format.jsonToCsv(response, task);
            }

        })
        .then(response => {
            return file.write(reqObj.name, response);
        })
        .then(response => {

            spinner.stop();

            if(_.isObject(response)){
                log.info(JSON.stringify(response, undefined, 4));
            }

            if(_.isString(response)){
                if(response.length >= 50000){
                    let b = Buffer.byteLength(response, 'utf8');
                    log.info(response.substring(0, 800) + "....");
                    log.warn("Large file output generated (" + bytes(b) + "), redacting from console.");
                } else {
                    log.info(response);
                }
            }

            log.info("Request Summary:");
            log.info(requestStats.get());

        })
        .catch(err => {

            console.log(err);

            spinner.stop();

            if(err.response.body){
                log.error(err.response.body);
            } else {
                log.error(JSON.stringify(err, undefined, 4));
            }

        });
});
