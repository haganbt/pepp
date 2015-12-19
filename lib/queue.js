"use strict";

const Queue = require("promise-queue");
const config = require('config');
const _ = require('underscore');

const cacheHelper = require('./helpers/cache');
const request = require('./request');

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
    return queue.add(function() {
        return request.make(task);
    }).then(response => {

        if(task.cache){
            cacheHelper.addData(task.cache.cacheId, task.cache.mergeKey, response.analysis.results);
            let cache = cacheHelper.get(task.cache.cacheId);
            if(cache.remainingTasks === 0){
                delete (cache.remainingTasks);
                return _.extend(cache, {});
            }
        } else {
            return response;
        }

    }).catch(function(err){
        console.log(err);
    });
};
