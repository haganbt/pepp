"use strict";

module.exports = {
    "app": {
        "format": "csv", // json, csv
        "write_to_file": true, // true, false
        "max_parallel_tasks": 1, // number of parallel requests
        "log_level": "info", // warn, info, debug, trace
        "date_format": "YYYY-MM-DD HH:mm:ss",
        "api_resource": "task", // analyze, task
        "task_uri": "https://api.datasift.com/v1.4/pylon/linkedin/task",
        "analyze_uri": "https://api.datasift.com/v1.3/pylon/analyze"
    }
};
