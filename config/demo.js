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
        },
        "jellystone": {
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
                "target": "fb.author.gender"
            },


            {
                "target": "fb.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.parent.author.region",
                    "threshold": 5,
                    "then": {
                        "target": "fb.parent.topics.name",
                        "threshold": 2
                    }
                }
            },



            /*
            {
                "merged_native_nested": [
                    {
                        "target": "fb.author.age",
                        "threshold": 3
                    },
                    {
                        "id": "yogi",
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                ]
            },

            {
                "id": "yogi",
                "target": "fb.author.gender",
                "threshold": 2
            },






            {
                "target": "fb.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.parent.author.region",
                    "threshold": 5,
                    "then": {
                        "target": "fb.parent.topics.name",
                        "threshold": 2
                    }
                }
            },




            {
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
            */
        ],
        "timeSeries": [
        /*
            {
                "interval": "day"
            },

            {
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
                "interval": "month"
            },
            {
                "multi_index_merged_custom_nested": [
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
            },
            {
                "multi_index_merged_native_nested": [
                    {
                        "id": "yogi",
                        "index": "other",
                        "interval": "month",
                        "then": {
                            "type": "freqDist",
                            "target": "fb.author.age",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.gender",
                                "threshold": 2,
                                "child": {
                                    "target": "fb.type",
                                    "threshold": 2
                                }
                            }
                        }
                    },
                    {
                        "id": "booboo",
                        "interval": "month",
                        "then": {
                            "type": "freqDist",
                            "target": "fb.author.age",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.gender",
                                "threshold": 2,
                                "child": {
                                    "target": "fb.type",
                                    "threshold": 2
                                }
                            }
                        }
                    }
                ]
            }*/
        ]
    }
};