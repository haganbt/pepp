"use strict";

const bunyan = require("bunyan")
    , bformat = require("bunyan-format")
    , config = require("config")
    ;

const log_level = process.env.LOG_LEVEL || (config.has('app.log_level') ? config.get('app.log_level') : "info");


const formatOut = bformat({ outputMode: "short" , })
    , logger = bunyan.createLogger({
    name: "pepp",
    streams: [
        {
            level: log_level,
            stream: formatOut
        }/*,
         {
         level: 'info',
         // log ERROR and above to a file
         path: './output/test.log'
         }*/
    ]
});

module.exports = logger;
