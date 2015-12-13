"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
        "max_parallel_tasks": 10, // number of parallel requests
        "log_level": "info", // info, warn, debug
        "analyze_uri": "https://api.datasift.com/v1/pylon/analyze" //sandbox - https://pylonsandbox.datasift.com/v1/pylon/analyze
    }
};
