//todo - support POST as well as GET requests

"use strict";

const attempts = 2;

let failedRequests = {};

/**
 * Count failed requests using the GET URI as the key
 *
 * @param req - req object
 */
const setFailed = function setFailed(req){

    let uri = req.uri;

    failedRequests[uri] = failedRequests[uri] || 0;
    failedRequests[uri] ++;
};


/**
 * Returns the current number of retries
 *
 * @param req
 * @returns int
 */
const getAttempts = function getAttempts(req){
    let uri = req.uri;
    return failedRequests[uri];
};


/**
 *
 * @param req
 * @returns {boolean}
 */
const shouldRetry = function shouldRetry(req){

    let uri = req.uri;

    if(failedRequests[uri] <= attempts){
        return true;
    }
    //console.log(JSON.stringify(failedRequests, undefined, 4));
    return false;
};


exports.setFailed = setFailed;
exports.shouldRetry = shouldRetry;
exports.getAttempts = getAttempts;