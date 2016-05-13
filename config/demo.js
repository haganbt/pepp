"use strict";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true
    },
    "index": {
        "default": {
            "id": "<RECORDING_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        }
    },
    "analysis": {
        "freqDist": [

            {
                "target": "fb.parent.author.gender"
            }

        ],
        "timeSeries": [

            {
                "interval": "day"
            }
            
        ]
    }
};