"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const baseline = require('../../lib/baseline');

const obj = [
    {
        "baseline": [
            {
                "key": "25-34",
                "interactions": 3471800,
                "unique_authors": 2832100,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 2018200,
                            "unique_authors": 1659500
                        },
                        {
                            "key": "male",
                            "interactions": 1431700,
                            "unique_authors": 1064400
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "35-44",
                "interactions": 2712400,
                "unique_authors": 2097000,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1708400,
                            "unique_authors": 1322300
                        },
                        {
                            "key": "male",
                            "interactions": 987500,
                            "unique_authors": 750600
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "18-24",
                "interactions": 2365500,
                "unique_authors": 1798900,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1366600,
                            "unique_authors": 1021900
                        },
                        {
                            "key": "male",
                            "interactions": 984500,
                            "unique_authors": 730300
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "45-54",
                "interactions": 2078100,
                "unique_authors": 1609400,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1361700,
                            "unique_authors": 1066900
                        },
                        {
                            "key": "male",
                            "interactions": 703700,
                            "unique_authors": 538800
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "55-64",
                "interactions": 1335400,
                "unique_authors": 955300,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 931100,
                            "unique_authors": 678900
                        },
                        {
                            "key": "male",
                            "interactions": 395100,
                            "unique_authors": 294500
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "65+",
                "interactions": 874000,
                "unique_authors": 634200,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 614900,
                            "unique_authors": 454100
                        },
                        {
                            "key": "male",
                            "interactions": 251900,
                            "unique_authors": 191700
                        }
                    ],
                    "redacted": false
                }
            }
        ],
        "NJsnoc9Cl": [
            {
                "key": "25-34",
                "interactions": 3471800,
                "unique_authors": 2832100,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 2018200,
                            "unique_authors": 1659500
                        },
                        {
                            "key": "male",
                            "interactions": 1431700,
                            "unique_authors": 1064400
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "35-44",
                "interactions": 2712400,
                "unique_authors": 2097000,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1708400,
                            "unique_authors": 1322300
                        },
                        {
                            "key": "male",
                            "interactions": 987500,
                            "unique_authors": 750600
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "18-24",
                "interactions": 2365500,
                "unique_authors": 1798900,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1366600,
                            "unique_authors": 1021900
                        },
                        {
                            "key": "male",
                            "interactions": 984500,
                            "unique_authors": 730300
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "45-54",
                "interactions": 2078100,
                "unique_authors": 1609400,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1361700,
                            "unique_authors": 1066900
                        },
                        {
                            "key": "male",
                            "interactions": 703700,
                            "unique_authors": 538800
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "55-64",
                "interactions": 1335400,
                "unique_authors": 955300,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 931100,
                            "unique_authors": 678900
                        },
                        {
                            "key": "male",
                            "interactions": 395100,
                            "unique_authors": 294500
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "65+",
                "interactions": 874000,
                "unique_authors": 634200,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 614900,
                            "unique_authors": 454100
                        },
                        {
                            "key": "male",
                            "interactions": 251900,
                            "unique_authors": 191700
                        }
                    ],
                    "redacted": false
                }
            }
        ]
    }
];

const task = {
    "method": "POST",
    "auth": {
        "user": "pylonsandbox",
        "pass": "3abea8c0f5209b087a1482b5e5ccc337"
    },
    "uri": "https://api.datasift.com/v1.3/pylon/analyze",
    "json": {
        "id": "8993d817e07627385e99ca71d9634441",
        "start": 1456962940,
        "end": 1459727740,
        "parameters": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.age",
                "threshold": 6
            },
            "child": {
                "analysis_type": "freqDist",
                "parameters": {
                    "target": "fb.author.gender",
                    "threshold": 2
                }
            }
        }
    },
    "name": "merged_custom_nested_baseline",
    "cache": {
        "cacheId": "91fb1de0-f9f7-11e5-a8ee-bf02f24a9b17",
        "mergeKey": "E1p53q9Ax"
    }
};

const stats = {
    "baseline": {
        "total_unique_authors": 9773900,
        "25-34": {
            "female": {
                "unique_authors": 1659500
            },
            "male": {
                "unique_authors": 1064400
            }
        },
        "35-44": {
            "female": {
                "unique_authors": 1322300
            },
            "male": {
                "unique_authors": 750600
            }
        },
        "18-24": {
            "female": {
                "unique_authors": 1021900
            },
            "male": {
                "unique_authors": 730300
            }
        },
        "45-54": {
            "female": {
                "unique_authors": 1066900
            },
            "male": {
                "unique_authors": 538800
            }
        },
        "55-64": {
            "female": {
                "unique_authors": 678900
            },
            "male": {
                "unique_authors": 294500
            }
        },
        "65+": {
            "female": {
                "unique_authors": 454100
            },
            "male": {
                "unique_authors": 191700
            }
        }
    },
    "NJsnoc9Cl": {
        "total_unique_authors": 9773900,
        "25-34": {
            "female": {
                "unique_authors": 1659500
            },
            "male": {
                "unique_authors": 1064400
            }
        },
        "35-44": {
            "female": {
                "unique_authors": 1322300
            },
            "male": {
                "unique_authors": 750600
            }
        },
        "18-24": {
            "female": {
                "unique_authors": 1021900
            },
            "male": {
                "unique_authors": 730300
            }
        },
        "45-54": {
            "female": {
                "unique_authors": 1066900
            },
            "male": {
                "unique_authors": 538800
            }
        },
        "55-64": {
            "female": {
                "unique_authors": 678900
            },
            "male": {
                "unique_authors": 294500
            }
        },
        "65+": {
            "female": {
                "unique_authors": 454100
            },
            "male": {
                "unique_authors": 191700
            }
        }
    }
};

describe.skip("Baseline calculation", function(){

    
    it('should return a valid csv output', function() {

        return baseline.gen(obj, task)
        .then(function(result){
            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,baseline_total_authors,baseline_unique_authors,baseline_probability,comparator_total_authors,comparator_unique_authors_FOREGROUND,comparator_probability,index,expected_baseline_BACKGROUND\n' +
                '25-34,female,9773900,1659500,0.16978892765426287,9773900,1659500,0.16978892765426287,1,1659500\n' +
                '25-34,male,9773900,1064400,0.10890228056354168,9773900,1064400,0.10890228056354168,1,1064400\n' +
                '35-44,female,9773900,1322300,0.13528888161327618,9773900,1322300,0.13528888161327618,1,1322300\n' +
                '35-44,male,9773900,750600,0.07679636583144907,9773900,750600,0.07679636583144907,1,750600\n' +
                '18-24,female,9773900,1021900,0.10455396515208873,9773900,1021900,0.10455396515208873,1,1021900\n' +
                '18-24,male,9773900,730300,0.07471940576433153,9773900,730300,0.07471940576433153,1,730300\n' +
                '45-54,female,9773900,1066900,0.10915806382303891,9773900,1066900,0.10915806382303891,1,1066900\n' +
                '45-54,male,9773900,538800,0.055126408086843534,9773900,538800,0.055126408086843534,1,538800\n' +
                '55-64,female,9773900,678900,0.06946050194906844,9773900,678900,0.06946050194906844,1,678900\n' +
                '55-64,male,9773900,294500,0.03013126796877398,9773900,294500,0.03013126796877398,1,294500\n' +
                '65+,female,9773900,454100,0.046460471255077296,9773900,454100,0.046460471255077296,1,454100\n' +
                '65+,male,9773900,191700,0.019613460338247783,9773900,191700,0.019613460338247783,1,191700\n');
        });

    });




    describe("Probability calculation", function(){


        it('should calculate a probablility for each author count', function() {

            let p = baseline._calcAuthProbability(stats);

            console.log(JSON.stringify(p, undefined, 4));

        });

    });





    describe("Building stats from result set", function(){


        it('should generate a total author count for each task result', function() {

            let p = baseline._buildResultStats(obj);

            //console.log(JSON.stringify(p, undefined, 4));

        });

    });



});