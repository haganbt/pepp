"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
        "max_parallel_tasks": 10, // number of parallel requests
        "log_level": "info", // warn, info, debug, trace
        "date_format": "YYYY-MM-DD HH:mm:ss",
        "api_base_url": "https://api.datasift.com/",
        "api_resource": "analyze", // analyze, task
        "api_version": "1.3",
        "service": "linkedin" // facebook, linkdin
    }
};
