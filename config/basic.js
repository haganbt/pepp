"use strict";

module.exports = {
    "app": {
        "format": "json",
        "write_to_file": false
    },
    "hash": "<INDEX_HASH>",
    "auth": {
        "username": "<USERNNAME>",
        "api_key": "<API_KEY>"
    },
    "analysis": {
        "freqDist": [

            {
                "target": "fb.author.gender",
                "threshold": 2
            }/*,
            {
                "merged_native_nested": [
                    {
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "target": "fb.author.region",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                ]
            },
            {
                "target": "fb.link",
                "threshold": 200,
                "then": {
                    "target": "moe",
                    "threshold": 5,
                    "then": {
                        "target": "foo",
                        "threshold": 6,
                        "then": {
                            "target": "bar",
                            "threshold": 7
                        }
                    }
                }
            },*/
            /*,
            {
                "merged_custom_nested": [
                    {
                        "target": "fb.link",
                        "threshold": 200,
                        "then": {
                            "target": "moe",
                            "threshold": 5,
                            "then": {
                                "target": "foo",
                                "threshold": 6,
                                "then": {
                                    "target": "bar",
                                    "threshold": 7
                                }
                            }
                        }
                    },
                    {
                        "target": "fb.link",
                        "threshold": 200,
                        "then": {
                            "target": "moe",
                            "threshold": 5,
                            "then": {
                                "target": "foo",
                                "threshold": 6,
                                "then": {
                                    "target": "bar",
                                    "threshold": 7
                                }
                            }
                        }
                    }
                ]
            }
            */
        ],
        "timeSeries": [

        ]
    }
};