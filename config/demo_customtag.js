"use strict";

module.exports = {
    "app": {
      "format": "csv",
      "write_to_file": false,
      //"log_level": "info", // warn, info, debug, trace
    },

    "index": {
      "default": {
        "subscription_id": "<SUBSCRIPTION_ID>",
        "auth": {
          "username": "<USERNNAME>",
          "api_key": "<API_KEY>"
        }
      }
    },
    "customTags": {
      "gender": [
          {
            "key":"male",
            "filter": "fb.author.gender == \"male\""
          },
          {
            "key":"female",
            "filter": "fb.author.gender == \"female\""
          }
      ],
      "age": [
          {
            "key":"18-24",
            "filter": "fb.author.age == \"18-24\""
          },
          {
            "key":"25-34",
            "filter": "fb.author.age == \"25-34\""
          }
      ]
    },
    "analysis": {
      "freqDist": [

        {
          "name": "example-fd-task_tag",
          "custom_tag": "gender",
          "then": {
            "custom_tag": "age",
            "then": {
              //"baseline":true,              
              "target": "fb.topics.name",
              "threshold":2
          }
          }
        },
        {
          "name": "example-fd-task",
                    "target": "fb.author.gender",
          "threshold": 2,
          "then": {
            "target": "fb.author.age",
            "threshold": 6,
            "then": {
            //"baseline":true,
              "target": "fb.topics.name",
              "threshold":2
            }
          }
        }

      ],
      "timeSeries": [

        

      ]
    }
};