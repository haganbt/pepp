"use strict";

module.exports = {
    "app": {
        "format": "csv",
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
        "jellystone": {
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
                "target": "fb.author.age",
                "threshold": 2
            },
            {
                "target": "fb.author.age",
                "threshold": 2,
                "then": {
                    "type": "timeSeries",
                    "interval": "week"
                }
            },
            {
                "merged_custom_nested": [
                    {
                        "index": "foo",
                        "id":"booboo",
                        "target": "fb.parent.author.age",
                        "threshold": 2,
                        "then": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.parent.topics.name",
                                "threshold": 2
                            }
                        }
                    },
                    {
                        "id": "yogi",
                        "target": "fb.parent.author.age",
                        "threshold": 2,
                        "then": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.parent.topics.name",
                                "threshold": 2
                            }
                        }
                    }
                ]
            },
            {
                "merged_native_nested": [
                    {
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
                        "then": {
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
                "target": "fb.author.age",
                "threshold": 2,
                "then": {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.author.region",
                        "threshold": 2
                    }
                }
            }
        ],
        "timeSeries": [
            {
                "merged_custom_nested": [
                    {
                        "id": "yogi",
                        "index": "other",
                        "interval": "month",
                        "then": {
                            "type": "freqDist",
                            "target": "fb.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        }
                    },
                    {
                        "id": "booboo",
                        "interval": "month",
                        "then": {
                            "type": "freqDist",
                            "target": "fb.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        }
                    }
                ]
            }

        ]
    }
};