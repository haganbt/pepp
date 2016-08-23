/**
 * CONTENT & MEDIA ANALYSIS - Content Discovery
 *
 * 1. Rename the tag namespace on line 12
 * 2. OPTIONAL BASELINE - Add each tag name from the same tag family as #1 to
 * each variable starting on line 15. If there are < than 10 tags, simply leave
 * the default placeholders and the results will be redacted.
 *
 * API CALLS: ~240
 *
 */

"use strict";

const tagTree = "interaction.tag_tree.<TAG_NAMESPACE>";

const tag_1 = "<TAG_1>";
const tag_2 = "<TAG_2>";
const tag_3 = "<TAG_3>";
const tag_4 = "<TAG_4>";
const tag_5 = "<TAG_5>";
const tag_6 = "<TAG_6>";
const tag_7 = "<TAG_7>";
const tag_8 = "<TAG_8>";
const tag_9 = "<TAG_9>";
const tag_10 = "<TAG_10>";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true
    },
    "index": {
        "default": {
            "subscription_id": "<RECORDING_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        },
        "baseline": {
            "subscription_id": "<RECORDING_ID>",
            "auth": {
                "username": "<USERNNAME>",
                "api_key": "<API_KEY>"
            }
        }
    },
    "start": require('moment').utc().subtract(13, 'days').unix(),
    "analysis": {
        "freqDist": [

        /**
         * tag media types
         */
            {
                "name": "tag_engagement_media_types",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.media_type",
                    "threshold": 10
                }
            },
        /**
         * tags
         */
            {
                "name": "tag_volumes",
                "target": tagTree,
                "threshold": 20,
            },
        /**
         * tag domains
         */
            {
                "name": "tag_domains",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "links.domain",
                    "threshold": 200
                }
            },
        /**
         * tag categories
         */
            {
                "name": "tag_categories",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.topics.category",
                    "threshold": 50
                }
            },
        /**
         * categories topics
         */
            {
                "name": "category_topics",
                "target": "fb.parent.topics.category",
                "threshold": 50,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 100
                }
            },
        /**
         * tag url's
         */
            {
                "name": "tag_urls",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "links.url",
                    "threshold": 200
                }
            },
        /**
         * tag engagement hashtags
         */
            {
                "name": "tag_engagement_hashtags",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.hashtags",
                    "threshold": 200
                }
            },
        /**
         * tag engagement topics
         */
            {
                "name": "tag_engagement_topics",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 50
                }
            },
        /**
         * Domain age gender
         */
            {
                "name": "domain_age_gender",
                "target": "links.domain",
                "threshold": 25,
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
         * domain url's
         */
            {
                "name": "domain_urls",
                "target": "links.domain",
                "threshold": 50,
                "then": {
                    "target": "links.url",
                    "threshold": 200
                }
            },
        /**
         * tag urls by hour
         */
            {
                "name": "tag_url_by_hour",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "links.url",
                    "threshold": 10,
                    "then": {
                        "analysis_type": "timeSeries",
                        "interval": "hour"
                    }

                }
            },
        /**
         * tag engagement countries
         */
            {
                "name": "tag_engagement_countries",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.author.country",
                    "threshold": 10
                }
            },
        /**
         * tag age gender
         */
            {
                "name": "tag_age_gender",
                "target": tagTree,
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
         * Baseline engagement tags
         */
            {
                "engagement_tag_baseline": [
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
                        "id": tag_1,
                        "filter": tagTree + " == \"" + tag_1 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_2,
                        "filter": tagTree + " == \"" + tag_2 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_3,
                        "filter": tagTree + " == \"" + tag_3 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_4,
                        "filter": tagTree + " == \"" + tag_4 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_5,
                        "filter": tagTree + " == \"" + tag_5 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_6,
                        "filter": tagTree + " == \"" + tag_6 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_7,
                        "filter": tagTree + " == \"" + tag_7 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_8,
                        "filter": tagTree + " == \"" + tag_8 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_9,
                        "filter": tagTree + " == \"" + tag_9 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_10,
                        "filter": tagTree + " == \"" + tag_10 + "\"",
                        "target": "fb.parent.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        }
                    }
                ]
            }
        ],
        "timeSeries": [


        ]
    }
};