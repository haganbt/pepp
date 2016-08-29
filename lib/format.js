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
function jsonToCsv(obj, task) {
    return new Promise(resolve => {


        //console.log(JSON.stringify(task, undefined, 4));
        //console.log(JSON.stringify(obj, undefined, 4));



        let csv = "interactions,unique_authors\n";
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
        let lastKey ="";
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


                    // collect stats for baseline
                    let x = eval(baseLineKey);

                    console.log("last key:", lastKey);

                    if(lastKey !== x){
                        stats[x] = stats[x] || {};
                        stats[x].unique_authors = o[i].unique_authors;
                    }

                    lastKey = x;
                    console.log("set last key:", lastKey);


                    stats.totalAuthors = stats.totalAuthors || 0;
                    stats.totalAuthors += o[i].unique_authors;


                    // build csv
                    csv += k4 + k3 + k2 + k1 + "," + o[i].interactions  + "," + o[i].unique_authors + "\n";

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

        for (let idx in stats) {

            //console.log(idx, stats[idx]);

            /*
            probs[idx] = probs[idx] || {};
            probs[idx].global = probs[idx].global || 0;
            probs[idx].global = stats[idx] / totalAuthors;


            probs[idx].localTotalAuthors = probs[idx].localTotalAuthors || 0;

            probs[idx].localTotalAuthors += stats[idx];

            */

        }




        //console.log(JSON.stringify(totalAuthors, undefined, 4));
        console.log(JSON.stringify(stats, undefined, 4));

        resolve(csv);
    })
    .catch(e => {
        log.error("Error parsing csv: " + e);
    });
};


exports.jsonToCsv = jsonToCsv;
