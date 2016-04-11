# STATUS: Unstable, WIP.

# PEPP
PYLON Exporter ++. Utility for exporting data from DataSift PYLON as JSON or CSV. It is the goal of this utility to 
support any combination of data extraction using a config (not code) approach. 

Features: 
 
 * Simplified JSON config "recipe" approach
 * Export as JSON or CSV
 * Cross-index query
 * Result set merging
 * Result set to query inheritance
 * Inbuilt queue to support large numbers of requests

 # Quick Start

* Edit ```config/demo.js``` and add values for the PYLON recording id along with authentication credentials.
* Run PEPP with the command ```node app.js```

# User Guide

PEPP uses a JSON configuration file to define request tasks. Each task is a request to the PYLON ```/analyze``` resource. With this is mind, usage requires 3 steps:

* Define request tasks within a config file
* Tell PEPP which config file to use
* Run tasks

## Config File Structure

todo

### Single Task

todo

### Nested Tasks

todo

#### Native Nested

todo

#### Custom Nested

todo

### Merged Tasks

todo

## Config File Selection

To specify which config file to use, set the ```NODE_ENV``` environment variable:

```export NODE_ENV=myConfigFile```

If ```NODE_ENV``` is not specified, the ```demo``` config file will be used i.e.load the ```/config/demo.js```
config file.


## Config Options
Below is a summary of all supported config options.

| Option        | Scope           | Description  |
|:------------- |:-------------|:-----|
| ```app.max_parallel_tasks```      | global | The number of tasks to run in parallel. |
| ```app.log_level```      | global | Output log level. ```debug``` shows full requests and responses. ```info```, ```warn```, ```debug```, ```trace``` |
| ```app.date_format```      | global | Format used for all data outputs. Defaults to ```YYYY-MM-DD HH:mm:ss```. See http://momentjs.com/docs/#/displaying/format/ |
| ```filter```      | task | OPTIONAL. PYLON analyze filter parameter containing CSDL |
| ```index.default.auth.api_key```      | global | The api key used for authentication |
| ```index.default.auth.username``` | global | The username used for authentication |
| ```index.default.id``` | global | The recording id of the index to analyze |
| ```index.default.analyze_uri``` | index | Overwrite the default analyze uri for a given index |
| ```id``` | merged task | A unique identifier for each merged task result set. Used to distinguish between results on output. |
| ```target``` | freqDist task | PYLON analyze target parameter |
| ```threshold``` | freqDist task | OPTIONAL. PYLON parameter to identify the threshold. Defaults to 200 of omitted |
| ```then``` | freqDist task | Specify custom nested task properties |
| ```then.type``` | task | Override custom nested task types |


### Filter Property

A ```filter``` property can be set as expected:

```json
{
    "filter": "interaction.tag_tree.property ==\"Yogi\"",
    "threshold": 2,
    "target": "fb.author.gender",
    "then": {
        "threshold": 3,
        "target": "fb.topics.name",
    }
}

```

**Custom Nested Filters**

In cases where a filter is used within a custom nested query (as per the above example), all child queries automatically inherit the parent filter property. For example, each child request would use the following filter format:

```json
"filter":"(fb.author.gender == \"female\") AND interaction.tag_tree.property ==\"Yogi\""
```

Currently it is not possible to overwrite the filter property for child queries.





## Index Credentials

One or more PYLON idexes must be defined by setting a parent ```index``` key. Credentials defined under the ```default```
key will be used unless overridden by setting an ```index``` parameter. The default analyze URI can also be overwritten 
to support a proxy:


```json
module.exports = {
   "index": {
     "default": {
       "id": "<RECORDING_ID>",
       "auth": {
         "username": "<USERNNAME>",
         "api_key": "<API_KEY>"
       }
     },
     "foo": {
       "analyze_uri": "https://pylonsandbox.datasift.com/v1/pylon/analyze", //<-- override analyze URI
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

## Logging

* "warn" : A note on something that should probably be looked at by an operator eventually.
* "info" : Detail on regular operation.
* "debug" : Anything else, i.e. too verbose to be included in "info" level.
* "trace" : Very detailed application logging.




# Example Config Recipes

## Multi-Index - Merged 3 Level Custom Nested

Top topics by age and gender from two different indexes:

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

## Multi-Index - Merged 2 Level Custom Nested with type override

Top topics by gender by week from two different indexes:

```json
"timeSeries": [
    {
        "merged_custom_nested": [
            {
                "id": "yogi",
                "index": "other",
                "interval": "week",
                "then": {
                    "type": "freqDist",
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.topics.name",
                        "threshold": 2
                    }
                }
            },
            {
                "id": "booboo",
                "interval": "week",
                "then": {
                    "type": "freqDist",
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.topics.name",
                        "threshold": 2
                    }
                }
            }
        ]
    }
]
```

Example response:

```json
 [
      {
          "booboo-1451865600-male": [
              {
                  "key": "BMW",
                  "interactions": 64700,
                  "unique_authors": 49200
              },
              {
                  "key": "Ford Motor Company",
                  "interactions": 26200,
                  "unique_authors": 20900
              }
          ],
          "yogi-1451865600-male": [
              {
                  "key": "Star Wars",
                  "interactions": 176000,
                  "unique_authors": 165800
              },
              {
                  "key": "Star Wars Movies",
                  "interactions": 88000,
                  "unique_authors": 88000
              }
          ],
          ...

```

## Demographic Baseline

Age/gender analysis from 2 different indexes. Automatically generate probabilities and index values:

```json
"freqDist": [

            {
                "merged_custom_nested_baseline": [
                    {
                        "id": "baseline",
                        "index": "baseline",
                        "target": "fb.author.region",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        }
                    },
                    {
                        "index": "baseline",
                        "target": "fb.author.region",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        }
                    }
                ]
            },
]
```

Example output:

```
category,key,baseline_total_authors,baseline_unique_authors,baseline_probability,comparator_total_authors,comparator_unique_authors_FOREGROUND,comparator_probability,index,expected_baseline_BACKGROUND
25-34,male,2144900,187300,0.0873234183411814,4625400,828700,0.17916288321010074,2.0517163278021626,403905.73919530044
25-34,female,2144900,356800,0.16634808149564081,4625400,786900,0.17012582695550654,1.0227098829508576,769426.4161499371
18-24,male,2144900,139600,0.06508461932957248,4625400,542300,0.11724391403986682,1.8014073869921945,301042.39824700454
18-24,female,2144900,256500,0.11958599468506691,4625400,464300,0.10038050763177239,0.8394001981262713,553133.0598163084
35-44,male,2144900,138800,0.06471164156837149,4625400,488700,0.10565572707225321,1.6327159149659647,299317.2269103455
35-44,female,2144900,298000,0.13893421604736816,4625400,558400,0.12072469408051195,0.8689342158835238,642626.3229054967
45-54,female,2144900,249800,0.11646230593500863,4625400,334300,0.07227483028494833,0.6205856023946584,538684.7498717889
45-54,male,2144900,115900,0.054035153153993196,4625400,217100,0.04693648116919618,0.8686286320949861,249934.19739848012
55-64,female,2144900,173700,0.0809827964007646,4625400,172900,0.037380550871275994,0.4615863187322964,374577.82647209655
55-64,male,2144900,70200,0.03272879854538673,4625400,81400,0.01759847796947291,0.5377062022325134,151383.7847918318
65+,female,2144900,112400,0.05240337544873887,4625400,97500,0.021079258010118045,0.4022500045009092,242386.57280059677
65+,male,2144900,45900,0.02139959904890671,4625400,52900,0.011436848704976866,0.5344421958018493,98981.7054408131
```