# STATUS: Unstable, WIP.

# PEPP
PYLON Exporter ++. Utility for exporting data from DataSift PYLON as JSON or CSV. PEPP mandates a config driven approach 
to data collection, rather than code. It is the goal of this utility to support any combination of data extraction from a PYLON index.

Features:
 
 * Simplified JSON config "recipe" approach
 * Export as JSON or CSV
 * Cross-index query
 * Result set merging
 * Result set to query inheritance
 * Inbuilt queue to support large numbers of requests
 * Parallel requests limit to manage control flow

 
## Config Options
Below is a summary of all supported config options.

| Option        | Scope           | Description  |
|:------------- |:-------------|:-----|
| ```app.max_parallel_tasks```      | global | The number of tasks to run in parallel. |
| ```app.log_level```      | global | Output log level. ```debug``` shows full requests and responses. ```info```, ```warn```, ```debug```, ```trace``` |
| ```index.default.auth.api_key```      | global | The api key used for authentication |
| ```index.default.auth.username``` | global | The username used for authentication |
| ```index.default.hash``` | global | The hash id of the index to analyze |
| ```index.default.analyze_uri``` | global | Overwrite the default analyze uri |
| ```id``` | merged tasks | A unique identifier for each merged task result set |


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


**Tests**

```
npm test
```

or


```
npm run test:watch
```

**Lint**

```
npm run lint
```

**Dev ENV Config**

```
source config/developer.sh
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