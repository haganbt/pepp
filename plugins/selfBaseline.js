"use strict";

module.exports = function(defaultResponse, normalizedResponse, configValue) {
    return new Promise(function(resolve, reject) {

        console.log("----------------------------------------------------");
        console.log(JSON.stringify(defaultResponse, undefined, 4));
        console.log(JSON.stringify(normalizedResponse, undefined, 4));
        console.log(JSON.stringify(configValue, undefined, 4));
        console.log("----------------------------------------------------");

        resolve(defaultResponse);
    });
};