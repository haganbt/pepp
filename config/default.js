"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
        "max_parallel_tasks": 10, // number of parallel requests
        "log_level": "info", // warn, info, debug, trace
        "analyze_uri": "https://api.datasift.com/v1.3/pylon/analyze",
        "date_format": "YYYY-MM-DD HH:mm:ss",
        "resource": "task", // analyze
        "service": "linkedin", // facebook
        "api_version": "1.4"
    }
};
