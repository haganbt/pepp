"use strict";

const config = require('config');
const _ = require('underscore');

const log = require("./helpers/logger");

const enrich_percentages = process.env.ENRICH_PERCENTAGES || (config.has('app.enrich_percentages') ? config.get('app.enrich_percentages') : true);


/**
 * Take an array of results objects and inject percentage values for
 * both interaction and unique_author counts.
 *
 * @param [resultsArray]
 * @returns {*}
 */
const __doPercentages = function(resultsArray, interactionCount, authorsCount) {

    log.trace("Calculating percentages for result set");


    /*
    let interaction_total = 0;
    let unique_authors_total = 0;

    //build totals

    for (let idx in resultsArray) {

        interaction_total += resultsArray[idx].interactions;
        unique_authors_total += resultsArray[idx].unique_authors;
    }
*/
    
    //add new key:values
    for (let idx in resultsArray) {

        let inter_normalized = resultsArray[idx].interactions / interactionCount;
        let auth_normalized = resultsArray[idx].unique_authors / authorsCount;

        resultsArray[idx].interactions_percentage = ( inter_normalized * 100 ).toFixed(2);
        resultsArray[idx].unique_authors_percentage = ( auth_normalized * 100  ).toFixed(2);
        resultsArray[idx].total_unique_authors = authorsCount;
    }

    return resultsArray;
};


/**
 * Recursively traverse a deep JSON object.
 * @param o
 * @returns {*}
 */
const __traverse = function(o, interactionCount, authorsCount) {

    for (var i in o) {
        if(i === "results"){
            o[i] = __doPercentages(o[i], interactionCount, authorsCount);
        }
        if (o[i] !== null && typeof(o[i])=="object") {
            __traverse(o[i], interactionCount, authorsCount);
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
        return __traverse(response, response.interactions, response.unique_authors);
    }
    return response;
};

exports.addPercentages = addPercentages;
