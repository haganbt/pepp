/**
 * AGE/GENDER MicroTarget
 * 
 *
 * 1. Define default and baseline index credentials
 * 2. Rename tag on line 14 to match CSDL.
 *
 * API CALLS: 2
 *
 */

"use strict";

const target = "interaction.tag_tree.<MY_TAG_TREE>";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true
        //"log_level": "trace"
    },
    "index": {
        "default": {
            "id": "<RECORDING_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        },
        "baseline": {
            "id": "<RECORDING_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        }
    },
    "analysis": {
        "freqDist": [
    /**
         * Age Gender microtarget by tag
         */
            {
        "nested_baseline_age_gender":[
            {
                "id": "newschool",
                "index": "default",
                "target": target,
                "threshold": 200,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.gender",
                        "threshold": 3
                    }
                }
            },
            {
                "id": "baseline",
                "index": "baseline",
                "target": "fb.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 3
                }
            }
        ]
    }


],
        "timeSeries": [
        
        ]
    }
};