"use strict";

const config = require('config')
    , moment = require('moment')
    , _ = require('underscore')
    ;


module.exports = {

    /**
     * @returns {obj}
     */
    getDefault: function () {

        let start = config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
        let end = config.has('end') ? config.get('end') : moment.utc().unix();

        return _.clone({
            'method': 'POST',
            'auth': {
                'user': process.env.AUTH_USER || (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""),
                'pass': process.env.AUTH_KEY || (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""),
            },
            'uri': process.env.ANALYZE_URI || (config.has('app.analyze_uri') ? config.get('app.analyze_uri') : "https://api.datasift.com/v1/pylon/analyze"),
            'json': {
                'hash': process.env.HASH || (config.has('index.default.hash') ? config.get('index.default.hash') : ""),
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
     * Check string is a valid target
     *
     * @param "str"
     * @returns {boolean}
     */
    isValidKey: function (str) {
        let arr = ["filter", "interval", "threshold", "target", "id", "name", "index"];
        return (arr.indexOf(str) != -1);
    },


    /**
     * Set index auth and hash if specified within
     * the task config using the "index" property.
     *
     * @param {task}
     * @param {reqObj}
     * @returns {reqObj}
     */
    getIndexCreds: function (task, reqObj) {
        if (task.index) {
            let index = task.index.toString();
            reqObj.auth.user = (config.has('index.' + index + '.auth.username') ? config.get('index.' + index + '.auth.username') : "");
            reqObj.auth.pass = (config.has('index.' + index + '.auth.api_key') ? config.get('index.' + index + '.auth.api_key') : "");
            reqObj.json.hash = (config.has('index.' + index + '.hash') ? config.get('index.' + index + '.hash') : "");
            delete (reqObj.json.parameters.parameters.index);
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
    }
};