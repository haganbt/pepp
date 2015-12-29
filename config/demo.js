"use strict";

module.exports = {
    "app": {
        "format": "json",
        "write_to_file": false
    },
    "index": {
        "default": {
            "hash": "<INDEX_HASH>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        },
        "baseline": {
            "hash": "<INDEX_HASH>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        }
    },
    "analysis": {
        "freqDist": [

            {
                "merged_native_nested": [
                    {
                        "index": "baseline",
                        "id":"booboo",
                        "target": "fb.author.region",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.age",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.gender",
                                "threshold": 2
                            }
                        }
                    },
                    {
                        "id": "yogi",
                        "target": "fb.author.region",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.age",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.gender",
                                "threshold": 2
                            }
                        }
                    }
                ]
            },
            {
                "index": "baseline",
                "target": "fb.author.region",
                "threshold": 2
            },
            {
                "target": "fb.author.age",
                "threshold": 2,
                "then": {
                    "target": "fb.author.gender",
                    "threshold": 2
                }
            }/*,
            {
                "id": "yogi",
                "target": "fb.author.age",
                "threshold": 2,
                "then": {
                    "target": "fb.author.region",
                    "threshold": 2
                }
            }
            {
                "merged_custom_nested": [
                    {
                        "id": "yogi",
                        "target": "fb.author.age",
                        "threshold": 2,
                        "then": {
                            "target": "fb.author.region",
                            "threshold": 2
                        }
                    },
                    {
                        "id": "booboo",
                        "target": "fb.author.gender",
                        "threshold": 2,
                        "then": {
                            "target": "fb.type",
                            "threshold": 2
                        }
                    }
                ]
            }*/
        ],
        "timeSeries": [

        ]
    }
};