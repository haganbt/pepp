"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format') : "json");


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


        csv = "key,interactions,unique_authors\n";

        let traverse = function traverse(o) {
            for (var i in o) {

                //merged? grab the array key
                if(isValidKey(i) === false && isInt(i) === false){
                    prefix = i;
                }

                //grand parent node
                if(o[i].key && o[i].child && o[i].child.results[0] && o[i].child.results[0].child && o[i].child.results[0].child.results[0]){
                    grandParent = o[i].key;
                }

                //parent node
                if(o[i].key && o[i].child){
                    parent = o[i].key;
                }

                //child node
                if(o[i].key && !o[i].child){

                    let pr = (prefix !== "") ? '"' + prefix + '",' : "";
                    let g = (grandParent !== "") ? '"' + grandParent + '",' : "";
                    let p = (parent !== "") ? '"' + parent + '",' : "";

                    csv += pr + g + p + o[i].key + "," + o[i].interactions  + "," + o[i].unique_authors;

                    if(o[i].unique_authors){
                        csv += "\n";
                    }
                }

                if (o[i] !== null && typeof(o[i])=="object") {
                    traverse(o[i]);
                }
            }
        };

        traverse(obj);

        if(parent === "" && prefix !== ""){
            csv = "category," + csv;
        }

        if(parent !== ""){
            csv = "category," + csv;
        }

        if(grandParent !== ""){
            csv = "id," + csv;
        }

        resolve(csv);
    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};


exports.jsonToCsv = jsonToCsv;
