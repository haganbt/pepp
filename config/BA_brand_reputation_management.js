/**
 * BRAND ANALYTICS - Brand Reputation Management
 *
 * 1. Rename tag on line 25 to match CSDL.
 *
 * 2. Add recording credentials to DEFAULT starting on line 44
 *
 * 3. Add recording credentials to BASELINE starting on line 51
 *      - If you do not have a separate index to baseline against,
 *      - you can simply repeat the credentials used for DEFAULT
 *      - to baseline each tag against the entire dataset.
 *
 * 4. Populate each tag name in to a variable starting on line 27.
 *      - If you do not have 10 tags, simply leave the tag placeholder
 *      - e.g. <TAG_5> and these queries will redact without error.
 *
 *
 * API CALLS: ~440 (with 10 tags)
 * CSV FILES: 31
 *
 */

"use strict";

const tagTree = "interaction.tag_tree.<MY_TAG_TREE>";

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
         * Author types
         */
           {
                "name": "author_type_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.author.type",
                    "threshold": 2
                }    
            },
            {
                "name": "parent_author_type_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.parent.author.type",
                    "threshold": 2
                }    
            },

        /**
         * Languages
         */            {
                "name": "language_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.language",
                    "threshold": 50
                }    
            },
            {
                "name": "parent_language_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.parent.language",
                    "threshold": 50
                }    
            },
        /**
         * Media types by entity
         */
            {
                "name": "media_types_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.media_type",
                    "threshold": 6
                }
            },
            {
                "name": "parent_media_types_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.parent.media_type",
                    "threshold": 6
                }
            },
        /**
         * Type by entity
         */
            {
                "name": "type",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.type",
                    "threshold": 6
                }
            },
         /**
         * Author Type
         */
            {
                "name": "author_type",
                "target": "fb.author.type",
                "threshold": 6
            },
        /**
         * Total Entity Volumes
         */
            {
                "name": "entity_volumes",
                "target": tagTree,
                "threshold": 10
            },
        /**
         * Age Gender tornadoes
         */
            {
                "name": "age_gender",
                "target": tagTree,
                "threshold": 10,
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
         * Entity volume by country
         */
            {
                "name": "country_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.author.country",
                    "threshold": 200
                }
            },
        /**
         * Entity volume by region
         */
            {
                "name": "region_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.author.country_region",
                    "threshold": 200
                }
            },
        /**
         * URLs and domains
         */
            {
                "name": "domains_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.domain",
                    "threshold": 25
                }
            },
            {
                "name": "links_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.url",
                    "threshold": 25
                }
            },
        /**
         * Categories and topics by entity
         */
            {
                "name": "topics_by_category_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.parent.topics.category",
                    "threshold": 25,
                    "then": {
                        "target": "fb.parent.topics.category_name",
                        "threshold": 50
                    }
                }
            },
        /**
         * Categories by entity
         */
            {
                "name": "categories_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.parent.topics.category",
                    "threshold": 200
                }
            },
        /**
         * Topics by entity
         */
            {
                "name": "topics_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.parent.topics.category_name",
                    "threshold": 200
                }
            },
        /**
         * Hashtags by entity
         */
            {
                "name": "hashtags_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "target": "fb.parent.hashtags",
                    "threshold": 50
                }
            },
        /**
         * Entity timeSeries
         */
            {
                "name": "timeSeries_by_entity",
                "target": tagTree,
                "threshold": 10,
                "then": {
                    "type": "timeSeries",
                    "interval": "day"
                }
            },
        /**
         * Entity sentiment by gender
         */
            {
                "name": "sentiment_gender_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
                    }
                }
            },
        /**
         * Entity sentiment by age
         */
            {
                "name": "sentiment_age_by_entity",
                "target": tagTree,
                "threshold": 10,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
                    }
                }
            },
        /**
         * region sentiment by age
         */
            {
                "name": "sentiment_age_by_region",
                "target": "fb.author.region",
                "threshold": 10,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
                    }
                }
            },


        /**
         * region sentiment by gender
         */
            {
                "name": "sentiment_gender_by_region",
                "target": "fb.author.region",
                "threshold": 10,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
                    }
                }
            },
        /**
         * topics sentiment by age
         */
            {
                "name": "sentiment_age_by_topics",
                "target": "fb.topics.name",
                "threshold": 10,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
                    }
                }
            },
        /**
         * topics sentiment by gender
         */
           {
                "name": "sentiment_gender_by_topics",
                "target": "fb.topics.name",
                "threshold": 10,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "child": {
                        "target": "fb.sentiment",
                        "threshold": 3
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
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_1,
                        "filter": tagTree + " == \"" + tag_1 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_2,
                        "filter": tagTree + " == \"" + tag_2 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_3,
                        "filter": tagTree + " == \"" + tag_3 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_4,
                        "filter": tagTree + " == \"" + tag_4 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_5,
                        "filter": tagTree + " == \"" + tag_5 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_6,
                        "filter": tagTree + " == \"" + tag_6 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_7,
                        "filter": tagTree + " == \"" + tag_7 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_8,
                        "filter": tagTree + " == \"" + tag_8 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_9,
                        "filter": tagTree + " == \"" + tag_9 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    },
                    {
                        "id": tag_10,
                        "filter": tagTree + " == \"" + tag_10 + "\"",
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                ]
            }
        ],
        "timeSeries": [
        /**
         * Daily Volumes
         */
            {
                "name": "timeSeries_by_day",
                "interval": "day"
            },
        /**
         * Topics by day
         */
            {
                "name": "topics_by_day",
                "interval": "day",
                "then": {
                    "type": "freqDist",
                    "target": "fb.parent.topics.name",
                    "threshold": 100
                }
            },
        /**
         * Hashtags by day
         */
            {
                "name": "hashtags_by_day",
                "interval": "day",
                "then": {
                    "type": "freqDist",
                    "target": "fb.parent.hashtags",
                    "threshold": 100
                }
            },
        /**
         * Links by day
         */
            {
                "name": "links_by_day",
                "interval": "day",
                "then": {
                    "type": "freqDist",
                    "target": "links.url",
                    "threshold": 100
                }
            }
        ]
    }
};