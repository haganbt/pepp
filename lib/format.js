"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format') : "json");

let logKey = [];
let baseLineLevels = [false,false,false,false];

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

    if (s.indexOf('\n') != -1) {
        s = s.replace(/\n/g, '');
    }

    if (s.match(/"|,/)) {
        s = '"' + s + '"';
    }
    return s;
}


/**
 * getBaselineKey - for a given task, return the nesting
 * level of the baseline flag if set.
 *
 * @param task
 * @returns {*}
 */
function getBaselineKey(task){
    console.log("The task is:" +JSON.stringify(task,undefined,4));
    let count = 0;
    let hasBaseline = false;
    let hasBaselineCount = 0;
    //let baseLineLevels = [false,false,false,false];

    let countTraverse = function countTraverse(task) {

        if(task.baseline){
            hasBaseline = true;
            hasBaselineCount ++;

            // log the target used for baseline
            if(task.custom_tag){
                logKey[count] = "Custom Tag (Level " + count + ")";
            }
            else if(task.target){
                logKey[count] = task.target;
            }

            //return count;
            console.log("At top: count = "+count);
            baseLineLevels[count] = true;
            console.log("At top: baseLineLevels ***"+baseLineLevels);
            //baseLineLevels.push(count);
        }

        else {
            baseLineLevels[count] = false;
        }

        for (var i in task) {
            if (task[i] !== null && typeof(task[i])=="object" && i !== "custom_tag") {
                count ++;
                if(task[i].baseline){
                    hasBaseline = true;
                    hasBaselineCount ++;

                    if(task[i].custom_tag){
                       logKey[count] = "Custom Tag (Level " + count + ")";
                    }
                    else if(task[i].target){
                        logKey[count] = task[i].target;
                    }

                    //return count;
                    console.log("in loop: count = "+count);
                    baseLineLevels[count] = true;
                    console.log("in loop: baseLineLevels ***"+baseLineLevels);
                    //baseLineLevels.push(count);
                }
                
                else {
                    baseLineLevels[count] = false;
                }
                countTraverse(task[i]);
            }
        }
        console.log("inside return ***"+baseLineLevels);
        return baseLineLevels;
    };

    countTraverse(task);

    if(hasBaseline === false){
        return false;
    } else {
        //return count;
        console.log("end return ***"+baseLineLevels);
        return baseLineLevels;
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

    return new Promise(resolve => {

        if (format !== 'csv') { resolve(obj); }

        let csv = "interactions,unique_authors";
        let splitKeys = 0;
        let splitCount = 0;
        let k4 = "";
        let k3 = "";
        let k2 = "";
        let k1 = "";

        // baseline
        let stats = {};
        let baseline = false; // calculate baseline?

        let baseLineKeys = getBaselineKey(task); // the keys to baseline against
        if(baseLineKeys !== false){
            log.info("Calculating self baseline.", logKey);
            baseline = true;
            csv += ",baseline,percent_of_total,total_authors";
        }
        let baseLineKey = baseLineKeys[0];
        console.log("********** baselinekeys" + baseLineKeys);
        console.log("********** baselinekey" + baseLineKey);
        console.log("********** logkey" + logKey);
        csv += "\n";


        /**
         *
         * @param n
         * @returns {boolean}
         */
        function isInt(n) {
            return n % 1 === 0;
        }


        /**
         *
         * @param i
         * @returns {boolean}
         */
        function isValidKey(i){
            const fields = ["total_unique_authors", "interactions_percentage", "unique_authors_percentage", "target", "results", "redacted", "analysis_type", "key", "interactions", "unique_authors", "child", "threshold", "parameters"];
            if(fields.indexOf(i) > -1){
                return true
            }
            return false;
        }


        let traverse = function traverse(o) {
            for (var i in o) {
                console.log("**** i is: "+i);
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


                // k2 node
                if(o[i].key && o[i].child && o[i].child.results[0] && o[i].child.results[0].child && o[i].child.results[0].child.results[0]){
                    k2 = escapeString(o[i].key) + ",";
                }

                // k3 node
                if(o[i].key && o[i].child){
                    k3 = escapeString(o[i].key) + ",";
                }

                // k4 node
                if(o[i].key && !o[i].child){

                    splitKeys = 1;

                    k4 = escapeString(o[i].key);


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
                    let splits = y.split(","); //this is the array of keys
                    
                    //let x = splits[baseLineKey]; //this is the key(s) for baselining
                    
                    //create string of baseLineKeys
                    //todo: check that splits and baseLineKeys are same length
                    let x = "";
                    for (let z = 0; z<splits.length; z++){
                        //is this key a baseline
                        if (baseLineKeys[z]){
                            x += splits[z] + ",";
                        }
                    }



                    stats = stats || {};
                    stats.totalAuthors = stats.totalAuthors || 0;
                    stats.totalAuthors += o[i].unique_authors;

                    stats.data = stats.data || {};
                    stats.data[y] = stats.data[y] || {};

                    stats.data[y].unique_authors = stats.data[y].unique_authors || 0;
                    stats.data[y].unique_authors += o[i].unique_authors;

                    stats.data[y].interactions = stats.data[y].interactions || 0;
                    stats.data[y].interactions += o[i].interactions;

                    // store the baseline key so that we can update the class
                    // author counts later.
                    //deleteme console.log ("x is: "+x);
                    stats.data[y].baselineKey = x;

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

        if(baseline === true) {

            // go through each of the class count totals and update each data item
            for (let idx in stats.class_count) {

                for (let d in stats.data) {

                    if (stats.data[d].baselineKey == idx) {
                        stats.data[d].class_total_unique_authors = stats.class_count[idx];
                    }
                }

            }

            // calculate baseline
            for (let eachObj in stats.data) {

                // baseline: class total authors / total_unique_authors
                stats.data[eachObj].baseline = stats.data[eachObj].class_total_unique_authors / stats.totalAuthors;

                // percent_of_total: unique_authors / total_unique_authors
                stats.data[eachObj].percent_of_total = stats.data[eachObj].unique_authors / stats.totalAuthors;

            }

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
                     +  "," + stats.data[key].percent_of_total
                 +  "," + stats.totalAuthors;
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
