"use strict";

const config = require('config')
    , moment = require('moment')
    , _ = require('underscore')
    , shortid = require('shortid')
    , uuid = require('node-uuid')
    ;

const log = require("./logger");


module.exports = {

    /**
     * 
     * @param obj
     * @returns {*}
     */
    generateName: function (obj) {
        if(obj.name){
            return obj.name;
        }
        if(obj.target && obj.then && obj.then.target){
            return obj.target + "-THEN-" + obj.then.target;
        }
        if(obj.interval && obj.then && obj.then.target){
            return obj.interval + "-THEN-" + obj.then.target;
        }
        if(obj.target && obj.filter){
            return obj.target + "--" + obj.filter;
        }
        if(obj.target && !obj.filter){
            return obj.target;
        }
        //timeSeries
        if(!obj.target && !obj.filter && obj.interval && obj.span){
            return obj.interval + "--span_" + obj.span;
        }
        if(!obj.target && obj.filter && obj.interval){
            return obj.filter + "--span_" + obj.interval;
        }
        return "name-not-specified-" + shortid.generate();
    },


    /**
     * Check string is a valid target
     *
     * @param "str"
     * @returns {boolean}
     */
    isValidKey: function (str) {
        let arr = ["filter", "interval", "threshold", "target", "id", "name", "index", "type", "subscription_id", "api_resource"];
        return (arr.indexOf(str) != -1);
    },


    /**
     * Remove expected "undefined" values and array nesting
     * caused by non returned promises due to recursive call
     * within promise chain.
     *
     * Flatten - Flattens a nested array (the nesting
     * can be to any depth). If you pass shallow,
     * the array will only be flattened a single level.
     *
     * Compact - Returns a copy of the array with all falsy
     * values removed. In JavaScript, false, null,
     * 0, "", undefined and NaN are all falsy.
     *
     * @param {obj}
     */
    compact: function (obj) {
        let flat = _.flatten(obj, false);
        return _.compact(flat);
    },


    /**
     * getEndTs - generate end timeStamp based on
     * a given start TS and interval string e.g. week
     *
     * @param start - int - unix ts
     * @param interval - string
     * @returns {number} - unix ts
     */
    getEndTs: function (start, interval){
        switch (interval) {
            case "minute":
                return start + 60;
            case "hour":
                return start + (60 * 60);
            case "day":
                return start + (60 * 60 * 24);
            case "week":
                return start + (60 * 60 * 24 * 7);
            case "month":
                return start + (60 * 60 * 24 * 30);
            default:
                return start + (60 * 60 * 24 * 30);
        }
    },

    /**
     * unixToHuman - convert unix TS to human readable format
     *
     * @param unixTs - int
     * @returns - moment object
     */
    unixToHuman: function (unixTs){
        let configFormat = process.env.DATE_FORMAT || (config.has('app.date_format') ? config.get('app.date_format') : "YYYY-MM-DD HH:mm:ss");
        return new moment.unix(unixTs).utc().format(configFormat);
    },


    /**
     * resUnixTsToHuman - for a given response object, convert
     * timestamps to human readable format.
     *
     * @param response
     * @returns {*}
     */
    resUnixTsToHuman: function (response){
        try {

            if (response.analysis.analysis_type === "timeSeries") {

                for (let result in response.analysis.results) {

                    let ts = response.analysis.results[result].key;
                    response.analysis.results[result].key = this.unixToHuman(ts);

                    log.trace("Converting unix timestam to human:", ts);
                }

            }
        } catch (e){
            log.error(e);
        }
        return response;
    }

};
