"use strict";

module.exports = function(defaultResponse, normalizedResponse, configValue, log) {
    return new Promise(function(resolve, reject) {

        log.info("----------------------------------------------------");
        log.info(defaultResponse);
        log.info(normalizedResponse);
        log.info(configValue);
        log.info("----------------------------------------------------");

        resolve(defaultResponse);
    });
};