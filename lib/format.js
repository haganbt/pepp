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
 * getBaselineKey - for a given task, return the nesting
 * level of the baseline falg if set.
 *
 * @param task
 * @returns {*}
 */
function getBaselineKey(task){
    let count = 0;
    let hasBaseline = false;
    let countTraverse = function countTraverse(task) {

        if(task.baseline){
            hasBaseline = true;
            return count;
        }

        for (var i in task) {
            if (task[i] !== null && typeof(task[i])=="object") {
                count ++;
                if(task[i].baseline){
                    hasBaseline = true;
                    return count;
                }
                countTraverse(task[i]);
            }
        }
    };

    countTraverse(task);

    console.log("getBaselIne returning:", count);

    if(hasBaseline === false){
        return false;
    } else {
        return count;
    }
}


/**
 * jsonToCsv - convert json to csv.
 * See /test/unitformat.test.js for supported formats
 *
 * @param obj
 * @returns {Promise}
 */
function jsonToCsv(obj, task) {

    log.info("Converting to CSV...");
    //console.log(JSON.stringify(obj, undefined, 4));
    //console.log(JSON.stringify(reqObj, undefined, 4));
    console.log(JSON.stringify(task, undefined, 4));

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
        let baseline = false; // calculate baseline?

        let baseLineKey = getBaselineKey(task); // the key to baseline against
        if(baseLineKey !== false){
            log.info("Calculating self baseline.")
            baseline = true;
            console.log("Using baseline key:", baseLineKey);
        }

        if (format !== 'csv') { resolve(obj); }


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
                    k1 = '';
                    if(i.includes('__')) {

                        let resToSplit = i.split("__");

                        //count the number of columns as this can vary
                        splitCount = resToSplit.length;

                        resToSplit.forEach(function (v) {
                            k1 += escapeString(v) + ",";
                        });

                    } else {

                        k1 =  escapeString(i) + ",";

                        splitCount = 1;
                    }
                }

                //console.log("k1: ", k1);

                // k2 node
                if(o[i].key && o[i].child && o[i].child.results[0] && o[i].child.results[0].child && o[i].child.results[0].child.results[0]){
                    k2 = escapeString(o[i].key) + ",";
                    //console.log("k2: ", k2);
                }

                // k3 node
                if(o[i].key && o[i].child){
                    k3 = escapeString(o[i].key) + ",";
                    //console.log("k3: ", k3);
                }

                // k4 node
                if(o[i].key && !o[i].child){

                    splitKeys = 1;

                    k4 = escapeString(o[i].key);

                    //console.log("k4: ", k4);

                    if(k2 !== ""){
                        splitKeys ++;
                    }

                    if(k3 !== ""){
                        splitKeys ++;
                    }

                    if(k4 !== ""){
                        splitKeys += splitCount;
                    }


                    // a string of the combined keys
                    let y = k1 + k2 + k3 + k4;

                    // Now that we have the correct key order as defined by y,
                    // we can easily marry up the selected baseline key from config.
                    let splits = y.split(",");
                    let x = splits[baseLineKey];

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
                    stats.class_count = stats.class_count || {};
                    stats.class_count[x] = stats.class_count[x] || 0;
                    stats.class_count[x] += o[i].unique_authors;
                }

                if (o[i] !== null && typeof(o[i])=="object") {

                    traverse(o[i]);
                }
            }
        };

        traverse(obj);



        // go through each of the class counts and update each data item
        for (let idx in stats.class_count) {

            for (let d in stats.data) {
                if(d.includes(idx)){
                    stats.data[d].class_total_unique_authors = stats.class_count[idx];
                }
            }

        }

        // calculate baseline
        for (let eachObj in stats.data) {

            // baseline: class total authors / total_unique_authors
            stats.data[eachObj].baseline = stats.data[eachObj].class_total_unique_authors / stats.totalAuthors;

            // index: unique_authors / total_unique_authors
            stats.data[eachObj].index = stats.data[eachObj].unique_authors / stats.totalAuthors;

        }


        // build csv
        for (let k = splitKeys; k > 0; k--) {
            csv = "key" + k + "," + csv;
        }

        for (let key in stats.data) {

            csv += key
                + "," + stats.data[key].interactions
                + "," + stats.data[key].unique_authors;

             if(baseline === true){
                 csv += "," + stats.data[key].baseline
                     +  "," + stats.data[key].index;
             }

            csv += "\n";
        }

        console.log("Baseline stats:",JSON.stringify(stats, undefined, 4));

        resolve(csv);
    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};


exports.jsonToCsv = jsonToCsv;
