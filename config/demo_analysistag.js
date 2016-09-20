"use strict";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": false
    },
    "index": {
        "default": {
            "subscription_id": "51eca9261121b57d8b2360780252257f",
            "auth": {
                "username": "pylonsandbox",
                "api_key": "46a84e82d9af70b8cb872a443109b433"
            }
        }
    },
    "analysisTags": {
        "gender": [
            {
                "key":"male",
                "filter": "fb.author.gender == \"male\""
            },
            {
                "key":"female",
                "filter": "fb.author.gender == \"female\""
            }
        ],
        "age": [
            {
                "key":"18-24",
                "filter": "fb.author.age == \"18-24\""
            },
            {
                "key":"25-34",
                "filter": "fb.author.age == \"25-34\""
            }
        ]
    },
    "analysis": {
        "freqDist": [
            {
                "name": "example-fd-task_tag",
                "analysis_tag": "gender",
                "then": {
                    "analysis_tag": "age",
                    "then": {
                        "target": "fb.topics.name",
                        "threshold":2
                    }
                }
            },
            {
                "name": "example-fd-task",
                "target": "fb.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "then": {
                        "target": "fb.topics.name",
                        "threshold":2
                    }
                }
            }
        ],
        "timeSeries": [
        ]
    }
};