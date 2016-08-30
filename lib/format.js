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

        let csv = "interactions,unique_authors,baseline,index\n";
        let splitKeys = 0;
        let splitCount = 0;
        let k4 = "";
        let k3 = "";
        let k2 = "";
        let k1 = "";

        // baseline
        let stats = {};
        let baseLineKey = ""; // the key to baseline against

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
                    k4 = '';
                    if(i.includes('__')) {

                        let resToSplit = i.split("__");

                        //count the number of columns as this can vary
                        splitCount = resToSplit.length;

                        resToSplit.forEach(function (v) {
                            k4 += escapeString(v) + ",";
                        });

                    } else {

                        k4 =  escapeString(i) + ",";

                        splitCount = 1;
                    }
                }

                //grand k2 node
                if(o[i].key && o[i].child && o[i].child.results[0] && o[i].child.results[0].child && o[i].child.results[0].child.results[0]){
                    k3 = escapeString(o[i].key) + ",";
                }

                //k2 node
                if(o[i].key && o[i].child){
                    k2 = escapeString(o[i].key) + ",";
                }

                //child node
                if(o[i].key && !o[i].child){

                    splitKeys = 1;

                    k1 = escapeString(o[i].key);

                    if(k2 === ""){
                        baseLineKey = "k1";
                    }

                    if(k2 !== ""){
                        splitKeys ++;
                        baseLineKey = "k2";
                    }

                    if(k3 !== ""){
                        splitKeys ++;
                        baseLineKey = "k3";
                    }

                    if(k4 !== ""){
                        splitKeys += splitCount;
                        baseLineKey = "k4";
                    }

                    // left-hand most key e.g. "k3"
                    let x = eval(baseLineKey);

                    // a string of the combined keys
                    let y = k4 + k3 + k2 + k1;

                    stats = stats || {};
                    stats.totalAuthors = stats.totalAuthors || 0;
                    stats.totalAuthors += o[i].unique_authors;

                    stats.data = stats.data || {};
                    stats.data[y] = stats.data[y] || {};

                    stats.data[y].unique_authors = stats.data[y].unique_authors || 0;
                    stats.data[y].unique_authors += o[i].unique_authors;

                    stats.data[y].interactions = stats.data[y].interactions || 0;
                    stats.data[y].interactions += o[i].interactions;


                    // keep a count of the total unique authors for the specific class
                    stats[x] = stats[x] || 0;
                    stats[x] += o[i].unique_authors;

                    // update all with the total class count
                    for (let idx in stats.data) {
                        if(idx.startsWith(x)){
                            stats.data[idx].class_total_unique_authors = stats[x];
                        }
                    }
                }

                if (o[i] !== null && typeof(o[i])=="object") {

                    traverse(o[i]);
                }
            }
        };

        traverse(obj);


        //append the csv headers
        for (let k = splitKeys; k > 0; k--) {
            csv = "key" + k + "," + csv;
        }

        // calculate baseline
        for (let eachObj in stats.data) {

            // baseline: class total authors / total_unique_authors
            stats.data[eachObj].baseline = stats.data[eachObj].class_total_unique_authors / stats.totalAuthors;

            // index: unique_authors / total_unique_authors
            stats.data[eachObj].index = stats.data[eachObj].unique_authors / stats.totalAuthors;

        }

        // build csv
        for (let key in stats.data) {

            csv += key
                + "," + stats.data[key].interactions
                + "," + stats.data[key].unique_authors
                + "," + stats.data[key].baseline
                + "," + stats.data[key].index
                +"\n";
        }

        log.trace("Baseline stats:",JSON.stringify(stats, undefined, 4));

        resolve(csv);
    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};


exports.jsonToCsv = jsonToCsv;
