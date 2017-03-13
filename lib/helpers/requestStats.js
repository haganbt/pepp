"use strict";

const Table = require("cli-table");

const reqStats = {};

/**
 *
 * @param method
 * @param uri
 */
const add = function add(method, uri) {
    // truncate the task id from GET /task/[task_id]
    if (method.toLowerCase() === "get" && uri.match(/\/task\/\w/i)) {
        const splits = uri.split("task/");

        uri = splits[0] + "[TASK_ID]";
    }

    reqStats[method] = reqStats[method] || {};
    reqStats[method][uri] = reqStats[method][uri] || 0;
    reqStats[method][uri] ++;
};

/**
 * Return csv
 */
const get = function get() {
    const table = new Table({
        head: ["Method", "URI", "Count"],
        colWidths: [10, 60, 10]
    });

    for (const method in reqStats) {
        for (const uri in reqStats[method]) {
            table.push([method, uri, reqStats[method][uri]]);
        }
    }

    return table.toString();
};

exports.add = add;
exports.get = get;