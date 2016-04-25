"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

let totalAuthors;


/**
 * takes a stats object and inserts a probability
 * score for each unique author record.
 *
 * unique authrors / total authors
 *
 * @param {s} - stats object
 * @returns {*} - modified stats object
 * @private
 */
function _calcAuthProbability(s){

    for (let i in s) {

        if(s && s.total_unique_authors){
            totalAuthors = s.total_unique_authors;
        }

        if(i === "unique_authors"){
            s.probability = s[i] / totalAuthors;
            log.trace("Calculated probability of " + s.probability + " (" + s[i] + " / " + totalAuthors + ")");
        }

        if (s[i] !== null && typeof(s[i])=="object") {
            _calcAuthProbability(s[i]);
        }
    }

    return s;
}


function isInt(n) {
    return n % 1 === 0;
}

function isValidKey(i){
    const fields = ["total_unique_authors", "target", "results", "redacted", "analysis_type", "key", "interactions", "unique_authors", "child", "threshold", "parameters"];
    if(fields.indexOf(i) > -1){
        return true
    }
    return false;
}



/**
 * Generate baseline stats from results
 * @param obj
 * @param task
 * @returns {Promise.<T>}
 */
function gen(obj, task) {
    return new Promise(function(resolve, reject) {

        log.trace("Generating baseline analytics for " + task.name);

        let prefix;
        let parent;
        let stats = {};

        //validation
        if(!task.json.parameters || !task.json.parameters.child) {
            reject("Only native nested )child) tasks supported for Baseline calculations.");
        }

        if(task.json.parameters.analysis_type !== "freqDist" || task.json.parameters.child.analysis_type !== "freqDist" ) {
            reject("Only freqDist tasks supported for Baseline calculations.");
        }


        let x = task.json.parameters.parameters.target;
        let y = task.json.parameters.child.parameters.target;

        if(!(x.includes('age') && y.includes('gender')) && !(x.includes('gender') && y.includes('age'))){
            reject("Only age-gender targets are currently supported for baseline calculations.");
        }

        let nameExists = false;
        let duplicateCount = 0;

        //count each of the task keys
        Object.keys(obj[0]).map(function(k){
            if(k.includes('baseline')){
                nameExists = true;
                duplicateCount ++;
            }
        });

        if(nameExists === false) {
            reject("At least one task must have a \"baseline\" ID parameter set.");
        }


        if(duplicateCount > 1) {
            reject("Only one task must have the id of \"baseline\"");
        }


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

        //calculate and inject probability in to stats obj
        stats = _calcAuthProbability(stats);

        let baseline;

        // pluck the baseline
        Object.keys(stats).map(function(resultSetId){
            if(resultSetId.includes('baseline')){
                baseline = stats[resultSetId];
                //delete stats[resultSetId];
            }
        });

        //console.log(JSON.stringify(baseline, undefined, 4));
        //console.log("======================");
        //console.log(JSON.stringify(stats, undefined, 4));

        let out = "id,category,key,total_unique_authors,unique_author,probability,index,expected_baseline\n";

        //level 1 - result set id
        Object.keys(stats).map(function(id){

            //level 2 - age or gender
            Object.keys(stats[id]).map(function(k1){
                //console.log(k1);

                // does the baseline have the key found in the 1st level comparator?
                if(baseline[k1]){

                    // level 3 - age or gender
                    Object.keys(stats[id][k1]).map(function(k2){

                        // does the baseline have the child key found in the 2nd level comparator?
                        if(baseline[k1][k2]){

                            baseline[k1][k2].index = (stats[id][k1][k2].probability / baseline[k1][k2].probability);

                            baseline[k1][k2].expected_baseline = stats[id].total_unique_authors * baseline[k1][k2].probability;

                            out += id + "," + k1 + "," + k2 + ","
                                + stats[id].total_unique_authors + "," + stats[id][k1][k2].unique_authors + ","
                                + stats[id][k1][k2].probability + "," + baseline[k1][k2].index + ","
                                + baseline[k1][k2].expected_baseline + "\n";
                        }

                    });

                }

            });

        });

        resolve(out);
    })
    .catch(e => {
        log.error("Error generating baseline: " + e);
    });
};

exports.gen = gen;

exports._calcAuthProbability = _calcAuthProbability;
