"use strict";

module.exports = function(response, normalizedResponse) {
    return new Promise(function(resolve, reject) {

        console.log("plugin called-----------------------------------");
        console.log(JSON.stringify(normalizedResponse, undefined, 4));
        console.log("plugin called-----------------------------------");


        resolve(response);
    });
};