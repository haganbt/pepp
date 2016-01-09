"use strict";

const config = require('config');
const _ = require('underscore');

const log = require("./helpers/logger");

/**
 * addPercentages - takes a native response from PYLON and augments
 * percentage values to each of the result arrays.
 *
 * @param response
 * @returns {*}
 */
const addPercentages = function(response){

    if(response && response.analysis && response.analysis.results){

        let interaction_total = 0;
        let unique_authors_total = 0;

        //build totals
        for(let idx in response.analysis.results){

            interaction_total += response.analysis.results[idx].interactions;

            unique_authors_total += response.analysis.results[idx].unique_authors;
        }

        //augment response
        for(let idx in response.analysis.results){

            response.analysis.results[idx].interactions_per = ( response.analysis.results[idx].interactions / interaction_total * 100  ).toFixed(2);

            response.analysis.results[idx].unique_authors_per = ( response.analysis.results[idx].unique_authors / unique_authors_total * 100  ).toFixed(2);

        }
    }

    return response;
};

exports.addPercentages = addPercentages;
