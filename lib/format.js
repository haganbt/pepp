"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format') : "json");


/**
 * escapeString - escape specific characters for CSV
 *
 * @param "s" - string
 * @returns string
 */
function escapeString(s){

    if (s.indexOf('"') != -1) {
        s = s.replace(/"/g, '""');
    }

    if (s.match(/"|,/)) {
        s = '"' + s + '"';
    }
    return s;
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

        let csv = "interactions,unique_authors\n";
        let splitKeys = 0;
        let count = 0;
        let prefix = "";
        let parent = "";
        let grandParent = "";

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

        let traverse = function traverse(o) {
            for (var i in o) {

                //Merged task?
                if(isValidKey(i) === false && isInt(i) === false){

                    //custom merged will merge result keys with "__"
                    if(i.includes('__')) {
                        let resToSplit = i.split("__");
                        //splitKeys = resToSplit.length;
                        resToSplit.forEach(function (v, i) {
                            prefix += escapeString(v) + ",";
                        });
                    } else {
                        prefix = i;
                    }
                }

                //grand parent node
                if(o[i].key && o[i].child && o[i].child.results[0] && o[i].child.results[0].child && o[i].child.results[0].child.results[0]){
                    grandParent = escapeString(o[i].key);
                    splitKeys ++;
                }

                //parent node
                if(o[i].key && o[i].child){
                    parent = escapeString(o[i].key);
                    splitKeys ++;
                }

                //child node
                if(o[i].key && !o[i].child){
                    csv += prefix + grandParent + parent + escapeString(o[i].key) + "," + o[i].interactions  + "," + o[i].unique_authors + "\n";
                    splitKeys ++;
                }


                if (o[i] !== null && typeof(o[i])=="object") {

                    traverse(o[i]);
                }
            }
        };

        traverse(obj);


        //append the csv headers
        for (let k = 1; k < splitKeys; k++) {
            csv = "key_" + k + "," + csv;
        }

        resolve(csv);

    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};


exports.jsonToCsv = jsonToCsv;
