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
 * @param {obj}
 * @returns "string" - CSV string without headers
 */
function nativeNested(obj){

    let output = "";
    let l1Results = obj.child;

    l1Results.forEach(function(level1) {

        let l1ResultsKey = level1.key;
        if(level1.child) {

            let l2Results = level1.child;
            l2Results.forEach(function (l2ResultsResults) {

                output += '"' + obj.key + '","' + l1ResultsKey + '","' +
                    l2ResultsResults.key + '",' +
                    l2ResultsResults.interactions +
                    "," + l2ResultsResults.unique_authors + "\n";
            });
        } else {
            output += '"' + obj.key + '","' + level1.key + '",' +
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
 * @returns {Promise}
 */
function jsonToCsv(obj) {
    return new Promise(resolve => {

        let csv = "";
        let prefix = "";
        let parent = "";

        if (format !== 'csv') { resolve(obj); }

        log.trace("Converting JSON to CSV");


        function isInt(n) {
            return n % 1 === 0;
        }

        function isValidKey(i){
            const fields = ["total_unique_authors", "interactions_percentage", "unique_authors_percentage", "target", "results", "redacted", "analysis_type", "key", "interactions", "unique_authors", "child", "threshold", "parameters"];
            if(fields.indexOf(i) > -1){
                return true
            }
                return false;
        }
        

        //csv = "category,key,key,interactions,unique_authors,percentage,total_unique_authors\n";

        console.log(JSON.stringify(obj, undefined, 4));


        let stats = {};

        let traverse = function traverse(o) {
            for (let i in o) {

                if(isValidKey(i) === false && isInt(i) === false){
                    prefix = i;

                    stats[prefix] = stats[prefix] || {};
                    stats[prefix].total_unique_authors = stats[prefix].total_unique_authors || 0;
                }

                if(o[i].key && o[i].child){
                    parent = o[i].key;

                    stats[prefix][parent] = stats[parent] || {};

                }

                if(o[i].key && !o[i].child){

                    let h = o[i].key;


                    stats[prefix][parent] = stats[prefix][parent] || {};
                    stats[prefix][parent][h] = stats[prefix][parent][h] || {};
                    stats[prefix][parent][h].unique_authors = stats[prefix][parent][h].unique_authors || o[i].unique_authors;

                    stats[prefix].total_unique_authors += o[i].unique_authors;

                }

                if (o[i] !== null && typeof(o[i])=="object") {
                    traverse(o[i]);
                }
            }
        };

        traverse(obj);


        // iterate stats object and calculate index score
        // unique authrors / total auuthors

        for (let s in stats) {

            for (let d in stats[s]){

                for (let t in stats[s][d]){
                    stats[s][d][t].index = stats[s][d][t].index ||  stats[s][d][t].unique_authors / stats[s].total_unique_authors;

                }

            }

        }



        console.log(JSON.stringify(stats, undefined, 4));

        //console.log(csv);
        resolve(csv);
    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};

exports.jsonToCsv = jsonToCsv;