"use strict";

const config = require('config')
    , moment = require('moment')
    , _ = require('underscore')
    , shortid = require('shortid')
    ;

const log = require("./logger");


module.exports = {

    /**
     * @returns {obj}
     */
    getDefaultTask: function () {

        let start = config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
        let end = config.has('end') ? config.get('end') : moment.utc().unix();

        // Build URL
        let uri = config.get("app.api_base_url")
            + config.get("app.api_version")
            + "/pylon/"
            + config.get("app.api_service")
            + "/" + config.get("app.api_resource");

        //todo - remove once v1.4 is live
        if(config.get("app.api_version") === "1.3"){
            uri = config.get("app.api_base_url") + "1.3/pylon/analyze";
        }

        return _.clone({
            'method': 'POST',
            'auth': {
                'user': process.env.AUTH_USER || (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""),
                'pass': process.env.AUTH_KEY || (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""),
            },
            'uri': uri,
            'json': {
                'id': process.env.ID || (config.has('index.default.id') ? config.get('index.default.id') : ""),
                'start': start,
                'end': end,
                'parameters': {
                    'analysis_type': 'freqDist',
                    'parameters': {}
                }
            }
        });
    },


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
        let arr = ["filter", "interval", "threshold", "target", "id", "name", "index", "type"];
        return (arr.indexOf(str) != -1);
    },


    /**
     * Set index auth and id if specified within
     * the task config using the "index" property.
     *
     * @param {task}
     * @param {reqObj}
     * @returns {reqObj}
     */
    getIndexCreds: function (task, reqObj) {
        if (task.index) {
            log.trace("Overwriting default index creds. Using:",task.index);

            let index = task.index.toString();
            reqObj.auth.user = process.env.SECONDARY_AUTH_USER || (config.has('index.' + index + '.auth.username') ? config.get('index.' + index + '.auth.username') : "");
            reqObj.auth.pass = process.env.SECONDARY_AUTH_KEY || (config.has('index.' + index + '.auth.api_key') ? config.get('index.' + index + '.auth.api_key') : "");
            reqObj.json.id = process.env.SECONDARY_ID || (config.has('index.' + index + '.id') ? config.get('index.' + index + '.id') : "");
            delete (reqObj.json.parameters.parameters.index);

            //override the uri if set
            reqObj.uri = config.has('index.' + index + '.analyze_uri') ? config.get('index.' + index + '.analyze_uri') : reqObj.uri;
        }
        return reqObj;
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
