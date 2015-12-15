"use strict";

const Queue = require("promise-queue");
const rp = require('request-promise');
const config = require('config');

const maxConcurrent = process.env.MAX_PARALLEL_TASKS ||
    (config.has('app.max_parallel_tasks') ? config.get('app.max_parallel_tasks') : 3);

const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);


/**
 * queueTask - add task to queue
 *
 * @param task
 * @returns {LocalPromise}
 */
exports.queueTask = function(task) {
    return queue.add(function() { return rp(task); });
};

//TODO - extract request