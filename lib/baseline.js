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
            reject("Only age/gender targets are currently supported for baseline calculations.");
        }

        let nameExists = false;
        let count = 0;
        let duplicateCount = 0;

        //count each of the task keys
        Object.keys(obj[0]).map(function(k){
            if(k.includes('baseline')){
                nameExists = true;
                duplicateCount ++;
            }
            count++;
        });

        if(nameExists === false) {
            reject("At least one task must have a \"baseline\" ID parameter set.");
        }

        if(count !== 2) {
           // reject("Baseline tasks must have exactly two tasks with different ID's; a baseline and a comparator.");
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

        //inject probability in to stats obj
        stats = _calcAuthProbability(stats);


        //console.log(JSON.stringify(stats, undefined, 4));

        Object.keys(stats).map(function(resultSetId, index){

            if(resultSetId.includes('baseline')){
                console.log(resultSetId, index);
            }

        });


        //



        /*

        let names = Object.keys(stats);

        let baseline = stats[names[1]];
        let comparator = stats[names[0]];

        if(names[0].includes('baseline')){
            baseline = stats[names[0]];
            comparator = stats[names[1]];
        }

        let out = "category,key,baseline_total_authors,baseline_unique_authors,baseline_probability,comparator_total_authors,comparator_unique_authors_FOREGROUND,comparator_probability,index,expected_baseline_BACKGROUND\n";

        for (let age in comparator) {
            for (let gender in comparator[age]) {

                baseline[age][gender].index = (comparator[age][gender].probability / baseline[age][gender].probability);

                baseline[age][gender].expected_baseline = comparator.total_unique_authors * baseline[age][gender].probability;

                out += age + "," + gender + ","
                    + baseline.total_unique_authors     + ","   + baseline[age][gender].unique_authors + ","    + baseline[age][gender].probability + ","
                    + comparator.total_unique_authors   + ","   + comparator[age][gender].unique_authors + ","  + comparator[age][gender].probability + ","
                    + baseline[age][gender].index       + ","   + baseline[age][gender].expected_baseline + "\n";

            }
        }
*/
        let out = "foo";
        resolve(out);
    })
    .catch(e => {
        log.error("Error generating baseline: " + e);
    });
};

exports.gen = gen;

exports._calcAuthProbability = _calcAuthProbability;