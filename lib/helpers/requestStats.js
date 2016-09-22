"use strict";

const Table = require('cli-table');

let reqStats = {};


/**
 *
 * @param method
 * @param uri
 */
const add = function add(method, uri){

    // truncate the task id from GET /task/[task_id]
    if(method.toLowerCase() === "get" && uri.match(/\/task\/\w/i)){
        let splits = uri.split("task/");
        uri = splits[0] + "[TASK_ID]";
    }

    reqStats[method] = reqStats[method] || {};
    reqStats[method][uri] = reqStats[method][uri] || 0;
    reqStats[method][uri] ++;
};


/**
 * Return csv
 */
const get = function get(){

    let table = new Table({
        head: ['Method', 'URI', 'Count']
        , colWidths: [10, 60, 10]
    });

    for (var method in reqStats) {
        for (var uri in reqStats[method]) {
            table.push([method, uri, reqStats[method][uri]])
        }
    }

    return table.toString();
};

exports.add = add;
exports.get = get;