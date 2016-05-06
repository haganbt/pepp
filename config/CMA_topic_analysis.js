/**
 * CONTENT & MEDIA ANALYSIS
 * - Topic Analysis
 *
 * 1. Define default and baseline index credentials
 * 2. Populate topic names of interest (CASE SENSITIVE!)
 *
 * API CALLS: ~240
 *
 */

"use strict";

const moment = require('moment');

const topic_1 = "<TOPIC_1>";
const topic_2 = "<TOPIC_2>";
const topic_3 = "<TOPIC_3>";
const topic_4 = "<TOPIC_4>";
const topic_5 = "<TOPIC_5>";
const topic_6 = "<TOPIC_6>";
const topic_7 = "<TOPIC_7>";
const topic_8 = "<TOPIC_8>";
const topic_9 = "<TOPIC_1>";
const topic_10 = "<TOPIC_1>";


module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true
    },
    "index": {
        "default": {
            "id": "f9e5219c898054524b1168d3c0981846",
            "auth": {
                "username": "pylonsandbox",
                "api_key": "3abea8c0f5209b087a1482b5e5ccc337"
            }
        },
        "baseline": {
            "id": "51eca9261121b57d8b2360780252257f",
            "auth": {
                "username": "pylonsandbox",
                "api_key": "46a84e82d9af70b8cb872a443109b433"
            }
        }
    },
    "start": moment.utc().subtract(13, 'days').unix(),    
    "analysis": {
        "freqDist": [
        /**
         * Top topics over time
         */            
            {
                "name": "timeSeries_by_topics",
                "target": "fb.parent.topics.name",
                "threshold": 50,
                "then": {
                    "type": "timeSeries",
                    "interval": "hour"
                }
            },
        /**
         * Links by topics
         */            
            {
                "name": "links_by_topics",
                "target": "fb.parent.topics.name",
                "threshold": 50,
                "then": {
                    "target": "links.url",
                    "threshold": 50
                }
            },
        /**
         * Hashtags by topics
         */
            {
                "name": "hashtags_by_topics",
                "target": "fb.parent.topics.name",
                "threshold": 50,
                "then": {
                    "target": "fb.parent.hashtags",
                    "threshold": 50
                }
            },
        /**
         * Topics of topics
         */
            {
                "name": "topics_by_topics",
                "target": "fb.parent.topics.name",
                "threshold": 50,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 20
                }
            },
        /**
         * Categories and topics
         */
            {
                "name": "topics_by_category",
                "target": "fb.parent.topics.category",
                "threshold": 20,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 20
                }
            },
        /**
         * Age Gender tornadoes
         */
            {
                "name": "age_gender_by_category",
                "target": "fb.parent.topics.category",
                "threshold": 20,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                }
            },
        /**
         * Baseline engagement topics and content
         */
            {
                "engagement_topics_baseline": [
                    {
                        "id": "baseline",
                        "index": "baseline",
                        "filter": "fb.type != \"story\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_1,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_1 + "\" or fb.parent.content any \"" + topic_1 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_2,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_2 + "\" or fb.parent.content any \"" + topic_2 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_3,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_3 + "\" or fb.parent.content any \"" + topic_3 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_4,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_4 + "\" or fb.parent.content any \"" + topic_4 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_5,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_5 + "\" or fb.parent.content any \"" + topic_5 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_6,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_6 + "\" or fb.parent.content any \"" + topic_6 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_7,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_7 + "\" or fb.parent.content any \"" + topic_7 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_8,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_8 + "\" or fb.parent.content any \"" + topic_8 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_9,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_9 + "\" or fb.parent.content any \"" + topic_9 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": topic_10,
                        "filter": "fb.type != \"story\" and (fb.parent.content any \"" + topic_10 + "\" or fb.parent.content any \"" + topic_10 + "\")",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    }
                ]
            }
        ]
    }
};