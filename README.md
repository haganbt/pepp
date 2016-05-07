# PEPP
PYLON Exporter ++. Utility for exporting data from DataSift PYLON as JSON or CSV. It is the goal of this utility to 
support any combination of data extraction using a config (not code) approach. 

Features: 
 
 * Simplified JSON config "recipe" approach
 * Export as JSON or CSV
 * Cross-index query
 * Result set merging
 * Result set to query inheritance
 * Request queue with concurrency limit

# Quick Start

* Edit ```config/demo.js``` and add values for the PYLON recording id along with authentication credentials.
* Run PEPP with the command ```node app.js```

# User Guide

PEPP uses a configuration file to define request tasks. Files can be configured as JSON, YAML, hjson, JSON5, CoffeeScript etc (see ```/config``` for examples of JSON and YAML). Each task defines a request to the PYLON ```/analyze``` resource. With this is mind, usage requires 3 steps:

* Define request tasks within a config file
* Tell PEPP which config file to use
* Run tasks

## Config File Structure

The config file contains an ```analysis``` object consisting of two arrays: ```freqDist``` and ```timeSeries```. Tasks (i.e. an analysis request to PYLON) are simply defined by specifying 
an object ```{ ... }``` within the desired request type array. The below example defines a single task for both a ```freqDist``` and ```timeSeries```. Note depending upn which request type is being run, PYLON
mandates specific key:values be present:

```json
  "analysis": {
    "freqDist": [
      {
        target: "fb.author.gender"
      }
    ],
    "timeSeries": [
      {
        interval: "day"
      }
    ]
  }
]
```

### Single Task

As noted above, to make a single request, define a single task object inside the required type array (```freqDist``` or ```timeSeries```):

```json
    "freqDist": [
      {
        "target": "fb.author.gender"
      }
]
```


### Nested Tasks

todo

#### Native Nested

todo

#### Custom Nested

Custom nested tasks offer increased flexibility over native nested tasks by adding support for all targets (native nested tasks are currently restricted to low cardinality targets only).

The workflow for custom nested tasks is simple in that each result key from a primary task is used to generates subsequent secondary tasks by using the key as a ```filter``` parameter.

Custom nested tasks are configured within the config file using the ```then``` object:

```json
"freqDist": [
    {
        "target": "fb.topics.name",
        "threshold": 2,
        "then": {  // <-- then object defines custom nested
            "target": "fb.author.gender",
            "threshold": 2
        }
    }
]
```

### Merged Tasks

todo

## Config File Selection

To specify which config file to use, set the ```NODE_ENV``` environment variable:

```export NODE_ENV=myConfigFile```

If ```NODE_ENV``` is not specified, the ```demo``` config file will be used i.e.load the ```/config/demo.js```
config file.

### Config File Directory

The directory from which config files are loaded cab be set by defining the ```NODE_CONFIG_DIR``` environment variable. This can be a full path from your root directory, or a relative path from the process if the value begins with ./ or ../.


## Config Options
Below is a summary of all supported config options.

| Option        | Scope           | Description  |
|:------------- |:-------------|:-----|
| ```app.max_parallel_tasks```      | global | The number of tasks to run in parallel. |
| ```app.log_level```      | global | Output log level. ```debug``` shows full requests and responses. ```info```, ```warn```, ```debug```, ```trace``` |
| ```app.date_format```      | global | Format used for all data outputs. Defaults to ```YYYY-MM-DD HH:mm:ss```. See http://momentjs.com/docs/#/displaying/format/ |
| ```end``` | global | OPTIONAL. unix timestamp. Defaults to now UTC |
| ```filter```      | task | OPTIONAL. PYLON analyze filter parameter containing CSDL |
| ```index.default.auth.api_key```      | global | The api key used for authentication |
| ```index.default.auth.username``` | global | The username used for authentication |
| ```index.default.id``` | global | The recording id of the index to analyze |
| ```index.default.analyze_uri``` | index | Overwrite the default analyze uri for a given index |
| ```id``` | merged task | A unique identifier for each merged task result set. Used to distinguish between results on output. |
| ```start``` | global | OPTIONAL. start time - unix timestamp. Defaults to now -30 days UTC |
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


### Start/End Properties

Optional ```start``` and ```end``` unix timestamp properties can be set at the global level to specify the time range for analysis queries.

In addition, if you are using a JavaScript config file (rather than JSON or YAML), you can use any JavaScript date library for simper configuration. For example, using moment.js:

```javascript
"use strict";

const moment = require('moment');

module.exports = {
    start: moment.utc().subtract(7, 'days').unix(),
    ...
```


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


## Demographic Baselines

PEPP supports baseline and microtargeting use cases by automatically calculating 1 or more probability comparators against a baseline data set.

NOTE: Currently, PEPP only supports age and gender targets for baseline comparisons. A baseline task can be created as follows:

**1) Name the merged tasks**
 
The merged task name must include the string "baseline" to trigger the baseline calculation workflow:

```json
 "freqDist": [
    {
        "merged_baseline_example": [ // <-- name must include "baseline"
            {
                task 1...
            },
            {
                task 2...
            }
        ]
    }
]    
```

**2) Create age/gender tasks**

Tasks can be age gender (or gender age, no difference) however all tasks must be identical i.e. if one task uses age and gender others should not use gender and age:

```json
 "freqDist": [
    {
        "merged_baseline_example": [
            {
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
            {
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
        ]
    }
]
```

**3) Add an ```id``` for each task**

Each task must have a unique ```id``` key and value. The baseline tasks must have an ```id``` that contains the string "baseline" to declare which result set to compare to.
Comparator tasks can have any ```id```. If the ```id``` is omitted, one will be generated:


```json
 "freqDist": [
    {
        "merged_baseline_example": [
            {
                "id": "yogi", //                    <-- unique id
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
            {
                "id": "baseline", //                <-- unique id
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
        ]
    }
]
```

**4) Define what you wish to baseline**

Using either a ```filter``` and/or a different ```index```, define the tasks accordingly to compare data sets. 

The below example uses a micro targeting approach to compare two products (defined using VEDO tags) within the default index, to the baseline index (note the different ```index``` parameter used to specify a different set of index credentials).

```json
 "freqDist": [
    {
        "merged_baseline_example": [
            {
                "id": "yogi",
                "filter": "interaction.tag_tree.brand == \"yogi\"", // <-- Yogi filter
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
            {
                "id": "booboo",
                "filter": "interaction.tag_tree.brand == \"booboo\"", // <-- Booboo filter
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
            {
                "id": "baseline",
                "index": "global" // <-- specify another index to query
                "target": "fb.parent.author.age",
                "threshold": 6,
                "child": {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            },
        ]
    }
]
```


### Baseline Calculations

When a baseline task is run, by default a CSV result set is generated with the following format:

| id       | category | key    | total_unique_authors | unique_author | probability | index       | expected_baseline |
|----------|----------|--------|----------------------|---------------|-------------|-------------|-------------------|
| baseline | 25-34    | female | 916900               | 178200        | 0.194350529 | 1           | 178200            |
| baseline | 25-34    | male   | 916900               | 81400         | 0.088777402 | 1           | 81400             |
| yogi     | 25-34    | male   | 1197600              | 237600        | 0.198396794 | 2.234766831 | 106319.8168       |
| yogi     | 25-34    | female | 1197600              | 159900        | 0.133517034 | 0.686990845 | 232754.1935       |
| booboo   | 25-34    | male   | 1971700              | 453300        | 0.229903129 | 2.589658222 | 175042.4038       |
| booboo   | 25-34    | female | 1971700              | 460900        | 0.233757671 | 1.202763236 | 383200.9379       |


* **total_unique_authors**: the total number of unique authors for the id
* **unique_author**: the unique author count for the specific ide, category and key combination
* **probability**: unique_author / total_unique_authors
* **index**: comparator probability / baseline probability
* **expected baseline**: total_unique_authors * baseline probability

With these results, it become simple to plot meaningful visualizations.

#### Bar Chart

Plotting ```unique_author``` (foreground) against ```expected_baseline``` (background):

![Baseline Bar Chart](https://raw.githubusercontent.com/haganbt/pepp/master/docs/baseline-bar.png)

#### Bubble Chart

Plotting the ```index``` with a reference line of 1:

![Baseline Bar Chart](https://raw.githubusercontent.com/haganbt/pepp/master/docs/baseline-bubble.png)


## Tableau Workbook Generation


| Use Case        | Config File Name           | Description  |
|:------------- |:-------------|:-----|
| Brand Analytics - Brand Reputation Management | ```BA_brand_reputation_management.js``` | [Full Details)[https://github.com/haganbt/pepp/wiki/Brand%20Reputation%20Management] |


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

**Contributing**

Pull requests welcome - with associated tests ;)


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