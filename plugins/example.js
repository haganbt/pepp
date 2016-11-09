"use strict";

module.exports = function(reqObj) {
    return new Promise(function(resolve, reject) {

        console.log("plugin called-----------------------------------");
        console.log(JSON.stringify(reqObj, undefined, 4));



        resolve("results from p1" + reqObj);
    });
};