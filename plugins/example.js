"use strict";

module.exports = function(reqObj) {
    return new Promise(function(resolve, reject) {

        console.log("plugin called-----------------------------------");



        resolve("results from p1" + reqObj);
    });
};