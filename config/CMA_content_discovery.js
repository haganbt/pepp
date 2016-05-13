/**
 * CONTENT & MEDIA ANALYSIS - Content Discovery
 *
 * 1. Rename tag on line 12 to match CSDL.
 *
 * API CALLS: 
 *
 */

"use strict";

const tagTree = "interaction.tag_tree.<MY_TAG_TREE>";

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
        }
    },
    "start": require('moment').utc().subtract(13, 'days').unix(),
    "analysis": {
        "freqDist": [
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
             * tag engagement categories
             */
            {
                "name": "tag_engagement_categories",
                "target": tagTree,
                "threshold": 20,
                "then": {
                    "target": "fb.parent.topics.category",
                    "threshold": 50
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
        ],
        "timeSeries": [

        ]
    }
};