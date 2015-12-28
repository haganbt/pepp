# PEPP
PYLON Exporter ++

## STATUS: Unstable, WIP.

**Tests**

```
npm test
```

**Lint**

```
npm run lint
```

## Index Credentials

One or more PYLON idexes must be defined by setting a parent ```index`` key. Credentials defined under the ```default```
key will be used unless overridden by setting an ```index``` parameter:

```json
module.exports = {
   "index": {
     "default": {
       "hash": "<INDEX_HASH>",
       "auth": {
         "username": "<USERNNAME>",
         "api_key": "<API_KEY>"
       }
     },
     "foo": {
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
         "index": "foo", //<-- override default creds
         "target": "fb.author.age",
         "threshold": 2
       },
       {
         "target": "fb.author.age",
         "threshold": 2
       }
     ]
   }
 };
```

## Logging

"warn" : A note on something that should probably be looked at by an operator eventually.
"info" : Detail on regular operation.
"debug" : Anything else, i.e. too verbose to be included in "info" level.
"trace" : Very detailed application logging.


**TODO**

* Merged custom nested
* Unlimited nesting hierarchy for custom nested
* Support for merged multi-index queries



# Advanced Usage

## Multi-Index - Merged Native Nested

Region, age, gender request from two different indexes:

```json
"analysis": {
    "freqDist": [
        {
            "merged_custom_nested": [
                {
                    "target": "fb.author.region",
                    "threshold": 6,
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
                    "index": "baseline", //<-- override default creds
                    "target": "fb.author.region",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.age",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                }
            ]
        }
    ]
}        
```        