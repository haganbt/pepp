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
            /*
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
            {
                "target": "fb.author.gender",
                "threshold": 800
            },
            {
                "merged_native_nested": [
                    {
                        "target": "moe",
                        "threshold": 300,
                        "child": {
                            "target": "bar",
                            "threshold": 5,
                            "child": {
                                "target": "bar2",
                                "threshold": 52
                            }
                        }
                    },
                    {
                        "target": "foo",
                        "threshold": 200,
                        "child": {
                            "target": "baz",
                            "threshold": 10,
                            "child": {
                                "target": "bar2",
                                "threshold": 52
                            }
                        }
                    }
                ]
            }/*,
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
            }*/
        ],
        "timeSeries": [

        ]
    }
};