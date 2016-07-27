"use strict";

const log = require("./helpers/logger");

/*
import request from 'request'
import _ from 'lodash'

const DEFAULT_MAX_RETRIES = 10
const DEFAULT_INTERVAL = 1 * 60 * 1000
const DEFAULT_VERBOSE = false
const DEFAULT_REQ_OPTS = { method: 'GET', json: true }

const getJSON = (url, opts) =>
    new Promise((resolve, reject) => {
        request(url, opts, (err, responseObj, responseBody) => {
            if (err) reject(err)
            return resolve(responseBody)
        })
    })

const timeout = (interval) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })

const buildConfig = (configObj) => {
    const config = {}
    config.verbose = configObj && !!configObj.verbose || DEFAULT_VERBOSE
    config.interval = configObj && configObj.interval || DEFAULT_INTERVAL
    config.maxRetries = configObj && configObj.maxRetries || DEFAULT_MAX_RETRIES
    config.requestOptions = configObj && configObj.requestOptions || DEFAULT_REQ_OPTS
    return config
}

const pollingRequest = (url, expect, configObj) =>
    new Promise(async (resolve, reject) => {
        const config = buildConfig(configObj)

        let retryCounter = 1
        let response = await getJSON(url, config.requestOptions)
        let isMatch = _.isMatch(response, expect)

        // early return if initial call matched the expected response
        if (isMatch) return resolve(response)

        while (!isMatch && retryCounter < config.maxRetries) {
            await timeout(config.interval)
            response = await getJSON(url, config.requestOptions)
            if (config.verbose) console.log('        response: ', response)
            isMatch = _.isMatch(response, expect)
            if (config.verbose) console.log(`        polling ${retryCounter}/${config.maxRetries}: ${isMatch}`)
            retryCounter += 1
        }

        if (isMatch) {
            return resolve(response)
        }

        if (config.verbose) console.log(`        response ${JSON.stringify(response)} didn't contain expected body after ${config.interval * config.maxRetries / 1000} seconds`)
        return reject(new Error(`Timeout error. Response ${JSON.stringify(response)} didn't contain expected body after ${config.interval * config.maxRetries / 1000} seconds`))
    });

exports.pollingRequest = pollingRequest;
*/
"use strict";


const request = ('request');
const underscore = ('underscore');

const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_INTERVAL = 1 * 3 * 1000;
const DEFAULT_REQ_OPTS = { method: 'GET', json: true };

let requestIds = [];


const getJSON = (url, opts) =>
    new Promise((resolve, reject) => {
        request(url, opts, (err, responseObj, responseBody) => {
            if (err) reject(err)
            return resolve(responseBody)
        })
    });

const timeout = (interval) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    });

const buildConfig = () => {
    const config = {}
    config.interval = DEFAULT_INTERVAL
    config.maxRetries = DEFAULT_MAX_RETRIES
    config.requestOptions = DEFAULT_REQ_OPTS
    return config
};



const foo = function foo(request, response) {


        requestIds.push(response.id);

        let url = "http://api-linkedin-sandbox.devms.net/v1.4/pylon/linkedin/task/" + response.id;


        const config = buildConfig();


        let p = getJSON(url, config.requestOptions)
            .then(function(res){

                console.log("===============================");
                console.log(res);
            });


        console.log("ids",requestIds);




        console.log(request);
        console.log(response);

};




exports.foo = foo;


