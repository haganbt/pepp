"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format') : "json");


/**
 * hasChildArray - diffrenciate between nested
 * array format and array.
 *
 * See /test/unitformat.test.js for supported formats
 *
 * @param obj
 * @returns {boolean}
 */
function hasChildArray(obj){
    let p = false;
    let t = _.values(obj[0]);

    t.map(function(x){
        if(typeof(x) === "object") {
            p = true;
        }
    });

    return p;
}


/**
 * nativeNested - process the native nested response
 * object paylod from PYLON to retunr a CSV string.
 *
 * @param {nestedObj}
 * @returns "string" - CSV string without headers
 */
function nativeNested(nestedObj){

    let output = "";
    let l1Results = nestedObj.child.results;

    l1Results.forEach(function(level1) {

        let l1ResultsKey = level1.key;
        if(level1.child) {

            let l2Results = level1.child.results;
            l2Results.forEach(function (l2ResultsResults) {

                output += '"' + nestedObj.key + '","' + l1ResultsKey + '","' +
                    l2ResultsResults.key + '",' +
                    l2ResultsResults.interactions +
                    "," + l2ResultsResults.unique_authors + "\n";
            });
        } else {
            output += '"' + nestedObj.key + '","' + level1.key + '",' +
                level1.interactions + "," + level1.unique_authors + "\n";
        }
    });

    return output;
}


/**
 * jsonToCsv - convert json to csv.
 * See /test/unitformat.test.js for supported formats
 *
 * @param obj
 * @returns {Promise|Promise.<T>}
 */
const jsonToCsv = function jsonToCsv(obj) {
    return new Promise(function(resolve){

        let csv = "";

        if(format !=='csv'){
            resolve(obj);
        }

        log.trace("Converting JSON to CSV");

        obj.map(function(nestedObj){

            // native nested
            if(nestedObj.child){
                csv += nativeNested(nestedObj);
            } else {
                if(hasChildArray(obj)===true){

                    //custom nested
                    csv = "category,key,interactions,unique_authors\n";
                    for(let idx in obj[0]){
                        let childArr = obj[0][idx];
                        for(let childIdx in childArr){
                            csv += '"' + idx + '",' + _.values(childArr[childIdx]).toString() + "\n";
                        }
                    }

                } else {
                    //non-nested
                    csv = "key,interactions,unique_authors\n";
                    obj.map(function(row){
                        csv += _.values(row).toString() + "\n";
                    });
                }
            }
        });

        resolve(csv);
    })
    .catch(function(e){
        log.error("Error parsing JSON to CSV: " + e)
    });
};

exports.jsonToCsv = jsonToCsv;
