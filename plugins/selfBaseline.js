"use strict";

module.exports = function(defaultResponse, normalizedResponse, configValue, log, task) {
    return new Promise(function(resolve, reject) {

        log.info("----------------------------------------------------");
        log.info(defaultResponse);
        log.info(normalizedResponse);
        log.info(configValue);
        log.info(task);
        log.info("----------------------------------------------------");

        resolve(defaultResponse);
    });
};