"use strict";

const config = require('config');

const rp = require('request-promise');

if(config.has("app.log_level") && (config.get("app.log_level") === "debug")){
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
