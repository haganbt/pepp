/**
 * BRAND ANALYTICS
 * - Brand Reputation Management
 *
 * API CALLS: ~230 (depending upon number of tags)
 */

"use strict";

module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true
    },
    "index": {
        "default": {
            "id": "160c7203aeebec0c2d179dc53e95cee9",
            "auth": {
                "username": "pylonsandbox",
                "api_key": "3abea8c0f5209b087a1482b5e5ccc337"
            }
        }
    },
    "analysis": {
        "freqDist": [
        /**
         * Global Data types
         */
            {
                "name": "types_global",
                "target": "fb.type",
                "threshold": 10
            },
            {
                "name": "media_types_global",
                "target": "fb.media_type",
                "threshold": 10
            },
            {
                "name": "parent_media_types_global",
                "target": "fb.parent.media_type",
                "threshold": 10
            },
            {
                "name": "author_type_global",
                "target": "fb.author.type",
                "threshold": 10
            },
            {
                "name": "parent_author_type_global",
                "target": "fb.parent.author.type",
                "threshold": 10
            },
        /**
         * Media types by entity
         */
            {
                "name": "media_types_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "child": {
                    "target": "fb.media_type",
                    "threshold": 6
                }
            },
        /**
         * Type by entity
         */
            {
                "name": "type",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "child": {
                    "target": "fb.type",
                    "threshold": 6
                }
            },
        /**
         * Total Entity Volumes
         */
            {
                "name": "entity_volumes",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10
            },
        /**
         * Age Gender tornadoes
         */
            {
                "name": "age_gender",
                "target": "interaction.tag_tree.automotive.brand",
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
         * Entity volume by region
         */
            {
                "name": "region_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "target": "fb.author.region",
                    "threshold": 200
                }
            },
        /**
         * URLs and domains
         */
            {
                "name": "domains_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.domain",
                    "threshold": 25
                }
            },
            {
                "name": "links_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.url",
                    "threshold": 25
                }
            },
        /**
         * Entity topics
         */
            {
                "name": "topics_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "target": "fb.topics.name",
                    "threshold": 100
                }
            },
        /**
         * Topic hashtags
         */
            {
                "name": "topic_hashtags",
                "target": "fb.topics.name",
                "threshold": 100,
                "then": {
                    "target": "fb.hashtags",
                    "threshold": 100
                }
            },
        /**
         * Entity timeSeries
         */
            {
                "name": "timeSeries_by_entity",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "type": "timeSeries",
                    "interval": "day"
                }
            },
        /**
         * Entity sentiment by gender - engagements
         */
            {
                "name": "sentiment_gender_by_entity_engagements",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "child": {
                        "target": "fb.parent.sentiment",
                        "threshold": 3
                    }
                }
            },
        /**
         * Entity sentiment by age - engagements
         */
            {
                "name": "sentiment_age_by_entity_engagements",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "child": {
                    "target": "fb.parent.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.parent.sentiment",
                        "threshold": 3
                    }
                }
            },
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