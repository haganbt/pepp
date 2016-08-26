"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
        "max_parallel_tasks": 10, // number of parallel requests
        "log_level": "info", // warn, info, debug, trace
        "date_format": "YYYY-MM-DD HH:mm:ss",
        "api_resource": "analyze", // analyze, task
        "task_uri": "https://api.datasift.com/v1.4/pylon/<SERVICE>/task",
        "analyze_uri": "https://api.datasift.com/v1.3/pylon/analyze"
    }
};
