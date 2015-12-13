"use strict";

var config = require('config')
    , moment = require('moment')
    , _ = require('underscore')
    ;


module.exports = {

    /**
     * @returns {obj}
     */
    getDefault: function () {
        let start = config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
        let end   = config.has('end') ? config.get('end') : moment.utc().unix();

        return _.clone({
            'method': 'POST',
            'auth': {
                'user': process.env.AUTH_USER || (config.has('auth.username') ? config.get('auth.username') : ""),
                'pass': process.env.AUTH_KEY || (config.has('auth.api_key') ? config.get('auth.api_key') : ""),
            },
            'uri': process.env.ANALYZE_URI || (config.has('app.analyze_uri') ? config.get('app.analyze_uri') : "https://api.datasift.com/v1/pylon/analyze"),
            'json': {
                'hash': process.env.HASH || (config.has('hash') ? config.get('hash') : ""),
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
     * @param str
     * @returns {boolean}
     */
    isValidKey: function(str){
        let arr = ["filter", "interval", "threshold", "target", "id", "name"];
        return (arr.indexOf(str) != -1);
    }

}