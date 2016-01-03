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

One or more PYLON idexes must be defined by setting a parent ```index``` key. Credentials defined under the ```default```
key will be used unless overridden by setting an ```index``` parameter. The default analyze URI can also be overwritten 
to support a proxy:


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
       "analyze_uri": "https://pylonsandbox.datasift.com/v1/pylon/analyze", //<-- override analyze URI
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

**Custom Nested Tasks**

If an ```index``` key is set as part of a parent custom nested task, the child task will inherit these values.

```json
{
    "index": "foo",
    "target": "fb.author.gender",
    "threshold": 2,
    "then": {
        "target": "fb.type", //<-- inherits "foo" creds
        "threshold": 2
    }
}
```                

## Logging

* "warn" : A note on something that should probably be looked at by an operator eventually.
* "info" : Detail on regular operation.
* "debug" : Anything else, i.e. too verbose to be included in "info" level.
* "trace" : Very detailed application logging.


# Development

```
source config/developer.sh
```

```
npm run test:watch
```


# Advanced Usage Examples

## Multi-Index - Merged 3 Level Custom Nested

Region, age, gender request from two different indexes:

```json
"analysis": {
    "freqDist": [
       {
           "merged_custom_nested": [
               {
                   "index": "foo", // will use ENV settings
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
       }
    ]
}        
```

Example response:

```json
[
      {
          "yogi-25-34-male": [
              {
                  "key": "BMW",
                  "interactions": 334100,
                  "unique_authors": 265200
              },
              {
                  "key": "Cars",
                  "interactions": 80900,
                  "unique_authors": 68100
              }
          ],
          "yogi-25-34-female": [
              {
                  "key": "BMW",
                  "interactions": 215700,
                  "unique_authors": 188000
              },
....
```