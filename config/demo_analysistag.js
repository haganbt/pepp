"use strict";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": false
    },
    "index": {
        "default": {
            "subscription_id": "<SUBSCRIPTION_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        }
    },
    "analysisTags": {
        "company": [ //<-- name to identify analysis_tag family
            {
                "key": "yogi",
                "filter": "fb.all.content contains_any \"yogi, the, a\""
            },
            {
                "key": "booboo",
                "filter": "fb.all.content contains_any \"booboo, and, birthday\""
            }
        ],
        "us_areas": [  //<-- second analysis_tag family
            {
                "key": "New England",
                "filter": "fb.author.country in \"United States\" and fb.author.region in \"Maine, Vermont, New Hampshire, Massachusetts, Rhode Island, Connecticut\""
            },
            {
                "key": "Pacific",
                "filter": "fb.author.country in \"United States\" and fb.author.region in \"Alaska, California, Hawaii, Oregon, Washington\""
            }
        ]
    },
    "analysis": {
        "freqDist": [
            {
                "name": "example-fd-task_tag",
                "analysis_tag": "company",  //<-- reference analysis_tag family
                "then": {
                    "analysis_tag": "us_areas",  //<-- reference analysis_tag family
                    "then": {
                        "target": "fb.topics.name",
                        "threshold":2
                    }
                }
            }
        ]
    }
};