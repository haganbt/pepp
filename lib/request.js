"use strict";

const config = require('config');

const rp = require('request-promise');

const logLevel = config.get("app.log_level");

if(logLevel === "debug"){
    require("request-debug")(rp);
}

/**
 * make - execute request
 * @param task
 * @returns {LocalPromise}
 */
exports.make = function(task) {
    return rp(task);
};
