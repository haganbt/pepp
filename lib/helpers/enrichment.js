"use strict";

const config = require('config');
const _ = require('underscore');

const log = require("./logger");

const enrich_percentages = process.env.ENRICH_PERCENTAGES || (config.has('app.enrich_percentages') ? config.get('app.enrich_percentages') : true);


/**
 * Take an array of results objects and inject percentage values for
 * both interaction and unique_author counts.
 *
 * @param [resultsArray]
 * @returns {*}
 */
const __doPercentages = function(resultsArray) {

    log.trace("Calculating percentages for result set");

    let interaction_total = 0;
    let unique_authors_total = 0;

    //build totals
    for (let idx in resultsArray) {
        interaction_total += resultsArray[idx].interactions;
        unique_authors_total += resultsArray[idx].unique_authors;
    }

    //add new key:values
    for (let idx in resultsArray) {
        resultsArray[idx].interactions_per = ( resultsArray[idx].interactions / interaction_total * 100  ).toFixed(2);
        resultsArray[idx].unique_authors_per = ( resultsArray[idx].unique_authors / unique_authors_total * 100  ).toFixed(2);
    }

    return resultsArray;
};


/**
 * Recursively traverse a deep JSON object.
 * @param o
 * @returns {*}
 */
const __traverse = function(o) {
    for (var i in o) {
        if(i === "results"){
            o[i] = __doPercentages(o[i]);
        }
        if (o[i] !== null && typeof(o[i])=="object") {
            __traverse(o[i]);
        }
    }
    return o;
};


/**
 * addPercentages - takes a native response from PYLON and augments
 * percentage values to each of the result arrays.
 *
 * @param response
 * @returns {*}
 */
const addPercentages = function(response){
    if(enrich_percentages === 'true'){
        return __traverse(response);
    }
    return response;
};

exports.addPercentages = addPercentages;
