"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const baseline = require('../../lib/baseline');

const mergedTwo = [
        {
            "baseline": [
                {
                    "key": "25-34",
                    "interactions": 2154200,
                    "unique_authors": 1794000,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 1308000,
                                "unique_authors": 1144800
                            },
                            {
                                "key": "male",
                                "interactions": 832000,
                                "unique_authors": 698000
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "35-44",
                    "interactions": 1654800,
                    "unique_authors": 1377200,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 1012500,
                                "unique_authors": 892400
                            },
                            {
                                "key": "male",
                                "interactions": 631300,
                                "unique_authors": 542600
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "45-54",
                    "interactions": 1056000,
                    "unique_authors": 918300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 646100,
                                "unique_authors": 556500
                            },
                            {
                                "key": "male",
                                "interactions": 403000,
                                "unique_authors": 353600
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "18-24",
                    "interactions": 1019400,
                    "unique_authors": 917100,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 659600,
                                "unique_authors": 572400
                            },
                            {
                                "key": "male",
                                "interactions": 351300,
                                "unique_authors": 316900
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "55-64",
                    "interactions": 500400,
                    "unique_authors": 437300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 315500,
                                "unique_authors": 283100
                            },
                            {
                                "key": "male",
                                "interactions": 180600,
                                "unique_authors": 154200
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "65+",
                    "interactions": 267100,
                    "unique_authors": 235900,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 156700,
                                "unique_authors": 134500
                            },
                            {
                                "key": "male",
                                "interactions": 106800,
                                "unique_authors": 92000
                            }
                        ],
                        "redacted": false
                    }
                }
            ],
            "Ek3gfC7JZ": [
                {
                    "key": "25-34",
                    "interactions": 111400,
                    "unique_authors": 93900,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "male",
                                "interactions": 69700,
                                "unique_authors": 60200
                            },
                            {
                                "key": "female",
                                "interactions": 40600,
                                "unique_authors": 34300
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "18-24",
                    "interactions": 88200,
                    "unique_authors": 72500,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "male",
                                "interactions": 57300,
                                "unique_authors": 46700
                            },
                            {
                                "key": "female",
                                "interactions": 29800,
                                "unique_authors": 26000
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "35-44",
                    "interactions": 41600,
                    "unique_authors": 37300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "male",
                                "interactions": 25900,
                                "unique_authors": 23100
                            },
                            {
                                "key": "female",
                                "interactions": 15300,
                                "unique_authors": 12900
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "45-54",
                    "interactions": 14700,
                    "unique_authors": 12000,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "female",
                                "interactions": 7400,
                                "unique_authors": 6000
                            },
                            {
                                "key": "male",
                                "interactions": 7100,
                                "unique_authors": 6200
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "55-64",
                    "interactions": 5100,
                    "unique_authors": 4200,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "male",
                                "interactions": 2800,
                                "unique_authors": 2300
                            },
                            {
                                "key": "female",
                                "interactions": 2300,
                                "unique_authors": 1900
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "65+",
                    "interactions": 4000,
                    "unique_authors": 3600,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.gender",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "male",
                                "interactions": 2300,
                                "unique_authors": 2000
                            },
                            {
                                "key": "female",
                                "interactions": 1600,
                                "unique_authors": 1400
                            }
                        ],
                        "redacted": false
                    }
                }
            ]
        }
    ];

const mergedThree = [
    {
        "baseline": [
            {
                "key": "25-34",
                "interactions": 3288500,
                "unique_authors": 2508100,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1940800,
                            "unique_authors": 1499700
                        },
                        {
                            "key": "male",
                            "interactions": 1327900,
                            "unique_authors": 971100
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "35-44",
                "interactions": 2500500,
                "unique_authors": 1968700,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1593300,
                            "unique_authors": 1237000
                        },
                        {
                            "key": "male",
                            "interactions": 893700,
                            "unique_authors": 667300
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "18-24",
                "interactions": 2240000,
                "unique_authors": 1652300,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1321600,
                            "unique_authors": 1017700
                        },
                        {
                            "key": "male",
                            "interactions": 905800,
                            "unique_authors": 640900
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "45-54",
                "interactions": 1888600,
                "unique_authors": 1394500,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 1271000,
                            "unique_authors": 970000
                        },
                        {
                            "key": "male",
                            "interactions": 607100,
                            "unique_authors": 468000
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "55-64",
                "interactions": 1236300,
                "unique_authors": 917300,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 891100,
                            "unique_authors": 646600
                        },
                        {
                            "key": "male",
                            "interactions": 337400,
                            "unique_authors": 253700
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "65+",
                "interactions": 815400,
                "unique_authors": 573600,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 592200,
                            "unique_authors": 422500
                        },
                        {
                            "key": "male",
                            "interactions": 217000,
                            "unique_authors": 151600
                        }
                    ],
                    "redacted": false
                }
            }
        ],
        "bar": [
            {
                "key": "25-34",
                "interactions": 742800,
                "unique_authors": 535700,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 463800,
                            "unique_authors": 298800
                        },
                        {
                            "key": "female",
                            "interactions": 275900,
                            "unique_authors": 236300
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "18-24",
                "interactions": 575000,
                "unique_authors": 390600,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 388400,
                            "unique_authors": 233100
                        },
                        {
                            "key": "female",
                            "interactions": 185400,
                            "unique_authors": 158000
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "35-44",
                "interactions": 528200,
                "unique_authors": 375500,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 293800,
                            "unique_authors": 193200
                        },
                        {
                            "key": "female",
                            "interactions": 231900,
                            "unique_authors": 192600
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "45-54",
                "interactions": 405500,
                "unique_authors": 290200,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 213700,
                            "unique_authors": 136600
                        },
                        {
                            "key": "female",
                            "interactions": 189700,
                            "unique_authors": 157400
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "55-64",
                "interactions": 233800,
                "unique_authors": 163500,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 117300,
                            "unique_authors": 71000
                        },
                        {
                            "key": "female",
                            "interactions": 115300,
                            "unique_authors": 91400
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "65+",
                "interactions": 132100,
                "unique_authors": 101800,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "female",
                            "interactions": 67000,
                            "unique_authors": 57900
                        },
                        {
                            "key": "male",
                            "interactions": 64200,
                            "unique_authors": 43600
                        }
                    ],
                    "redacted": false
                }
            }
        ],
        "foo": [
            {
                "key": "18-24",
                "interactions": 3224600,
                "unique_authors": 2294100,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 2558900,
                            "unique_authors": 1676800
                        },
                        {
                            "key": "female",
                            "interactions": 662900,
                            "unique_authors": 563600
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "25-34",
                "interactions": 2976000,
                "unique_authors": 2059800,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 2246900,
                            "unique_authors": 1429200
                        },
                        {
                            "key": "female",
                            "interactions": 718700,
                            "unique_authors": 604000
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "35-44",
                "interactions": 1789600,
                "unique_authors": 1196200,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 1239000,
                            "unique_authors": 782200
                        },
                        {
                            "key": "female",
                            "interactions": 540400,
                            "unique_authors": 464200
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "45-54",
                "interactions": 1017400,
                "unique_authors": 712600,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 637800,
                            "unique_authors": 415100
                        },
                        {
                            "key": "female",
                            "interactions": 373900,
                            "unique_authors": 301500
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "55-64",
                "interactions": 468600,
                "unique_authors": 331100,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 267800,
                            "unique_authors": 168800
                        },
                        {
                            "key": "female",
                            "interactions": 197900,
                            "unique_authors": 160500
                        }
                    ],
                    "redacted": false
                }
            },
            {
                "key": "65+",
                "interactions": 272900,
                "unique_authors": 203700,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "male",
                            "interactions": 159000,
                            "unique_authors": 112400
                        },
                        {
                            "key": "female",
                            "interactions": 111900,
                            "unique_authors": 96400
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
        "user": "cs_2",
        "pass": "e11bbe9c0e1d52977ff72731ba217ffa"
    },
    "uri": "https://api.datasift.com/v1.3/pylon/analyze",
    "json": {
        "id": "f35199ab7b6eedb0161d6f8c8d8af7a8",
        "start": 1457646891,
        "end": 1460411691,
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
        },
        "filter": "fb.author.country in \"United States\" and fb.type != \"story\""
    },
    "name": "merged_custom_nested_baseline",
    "cache": {
        "cacheId": "0438f290-0030-11e6-af1f-f75500fe48e3",
        "mergeKey": "batmanvsuperman"
    }
};

const stats = {
    "baseline": {
        "total_unique_authors": 2143700,
        "25-34": {
            "female": {
                "unique_authors": 358200
            },
            "male": {
                "unique_authors": 187100
            }
        },
        "35-44": {
            "female": {
                "unique_authors": 298600
            },
            "male": {
                "unique_authors": 138600
            }
        },
        "18-24": {
            "female": {
                "unique_authors": 254900
            },
            "male": {
                "unique_authors": 139200
            }
        },
        "45-54": {
            "female": {
                "unique_authors": 249400
            },
            "male": {
                "unique_authors": 115900
            }
        },
        "55-64": {
            "female": {
                "unique_authors": 174700
            },
            "male": {
                "unique_authors": 70600
            }
        },
        "65+": {
            "female": {
                "unique_authors": 110600
            },
            "male": {
                "unique_authors": 45900
            }
        }
    },
    "batmanvsuperman": {
        "total_unique_authors": 4625400,
        "25-34": {
            "male": {
                "unique_authors": 828700
            },
            "female": {
                "unique_authors": 786900
            }
        },
        "18-24": {
            "male": {
                "unique_authors": 542300
            },
            "female": {
                "unique_authors": 464300
            }
        },
        "35-44": {
            "male": {
                "unique_authors": 488700
            },
            "female": {
                "unique_authors": 558400
            }
        },
        "45-54": {
            "female": {
                "unique_authors": 334300
            },
            "male": {
                "unique_authors": 217100
            }
        },
        "55-64": {
            "female": {
                "unique_authors": 172900
            },
            "male": {
                "unique_authors": 81400
            }
        },
        "65+": {
            "female": {
                "unique_authors": 97500
            },
            "male": {
                "unique_authors": 52900
            }
        }
    }
};

describe("Baseline calculation", function(){

    
    it('should return a valid csv output - two merged results', function() {

        return baseline.gen(mergedTwo, task)
        .then(function(result){
            expect(result).to.be.an('string');
            expect(result).to.eql('id,category,key,total_unique_authors,unique_author,probability,index,expected_baseline\n' +
                'baseline,25-34,female,5741000,1144800,0.19940776868141438,1,1144800\n' +
                'baseline,25-34,male,5741000,698000,0.12158160599198746,1,698000\n' +
                'baseline,35-44,female,5741000,892400,0.15544330256052952,1,892400\n' +
                'baseline,35-44,male,5741000,542600,0.09451315101898623,1,542600\n' +
                'baseline,45-54,female,5741000,556500,0.09693433199790977,1,556500\n' +
                'baseline,45-54,male,5741000,353600,0.06159205713290367,1,353600\n' +
                'baseline,18-24,female,5741000,572400,0.09970388434070719,1,572400\n' +
                'baseline,18-24,male,5741000,316900,0.0551994426058178,1,316900\n' +
                'baseline,55-64,female,5741000,283100,0.04931196655634907,1,283100\n' +
                'baseline,55-64,male,5741000,154200,0.026859432154676885,1,154200\n' +
                'baseline,65+,female,5741000,134500,0.023427974220519072,1,134500\n' +
                'baseline,65+,male,5741000,92000,0.01602508273819892,1,92000.00000000001\n' +
                'Ek3gfC7JZ,25-34,male,223000,60200,0.2699551569506726,2.220361828157323,27112.698136213203\n' +
                'Ek3gfC7JZ,25-34,female,223000,34300,0.1538116591928251,0.7713423614832363,44467.93241595541\n' +
                'Ek3gfC7JZ,18-24,male,223000,46700,0.2094170403587444,3.7938252720086827,12309.47570109737\n' +
                'Ek3gfC7JZ,18-24,female,223000,26000,0.11659192825112108,1.1693820057471804,22233.966207977704\n' +
                'Ek3gfC7JZ,35-44,male,223000,23100,0.10358744394618834,1.0960109024973594,21076.43267723393\n' +
                'Ek3gfC7JZ,35-44,female,223000,12900,0.05784753363228699,0.3721455519755263,34663.856470998086\n' +
                'Ek3gfC7JZ,45-54,female,223000,6000,0.026905829596412557,0.27756759696856154,21616.356035533878\n' +
                'Ek3gfC7JZ,45-54,male,223000,6200,0.02780269058295964,0.45140058438000935,13735.02874063752\n' +
                'Ek3gfC7JZ,55-64,male,223000,2300,0.01031390134529148,0.3839955098788482,5989.653370492945\n' +
                'Ek3gfC7JZ,55-64,female,223000,1900,0.008520179372197309,0.17278117193848375,10996.568542065843\n' +
                'Ek3gfC7JZ,65+,male,223000,2000,0.008968609865470852,0.5596607525833495,3573.5934506183594\n' +
                'Ek3gfC7JZ,65+,female,223000,1400,0.006278026905829596,0.2679713938019904,5224.438251175753\n');
        });

    });


    it('should return a valid csv output - three merged results', function() {

        return baseline.gen(mergedThree, task)
            .then(function(result){
                expect(result).to.be.an('string');
                expect(result).to.eql('id,category,key,total_unique_authors,unique_author,probability,index,expected_baseline\n' +
                    'baseline,25-34,female,8946100,1499700,0.16763729446350925,1,1499700\n' +
                    'baseline,25-34,male,8946100,971100,0.1085500944545668,1,971100\n' +
                    'baseline,35-44,female,8946100,1237000,0.1382725433429092,1,1237000\n' +
                    'baseline,35-44,male,8946100,667300,0.07459116262952571,1,667300\n' +
                    'baseline,18-24,female,8946100,1017700,0.11375906819731503,1,1017700\n' +
                    'baseline,18-24,male,8946100,640900,0.07164015604565117,1,640900\n' +
                    'baseline,45-54,female,8946100,970000,0.10842713584690536,1,970000\n' +
                    'baseline,45-54,male,8946100,468000,0.05231329853232135,1,468000\n' +
                    'baseline,55-64,female,8946100,646600,0.07227730519444227,1,646600\n' +
                    'baseline,55-64,male,8946100,253700,0.028358726148824627,1,253700\n' +
                    'baseline,65+,female,8946100,422500,0.047227283397234546,1,422499.99999999994\n' +
                    'baseline,65+,male,8946100,151600,0.016945931746794693,1,151600\n' +
                    'bar,25-34,male,1869900,298800,0.15979464142467512,1.4720820117900175,202977.82162059445\n' +
                    'bar,25-34,female,1869900,236300,0.126370394138724,0.7538322217806486,313464.976917316\n' +
                    'bar,18-24,male,1869900,233100,0.1246590726776833,1.74007260115747,133959.92778976314\n' +
                    'bar,18-24,female,1869900,158000,0.08449649713888444,0.7427671347687669,212718.08162215937\n' +
                    'bar,35-44,male,1869900,193200,0.1033210332103321,1.385164536494758,139478.01500095014\n' +
                    'bar,35-44,female,1869900,192600,0.10300016043638698,0.744906819143057,258555.8287969059\n' +
                    'bar,45-54,male,1869900,136600,0.07305203486817477,1.3964333528508084,97820.63692558769\n' +
                    'bar,45-54,female,1869900,157400,0.0841756243649393,0.7763335599290552,202747.90132012832\n' +
                    'bar,55-64,male,1869900,71000,0.03796994491684047,1.3389157438728676,53027.98202568717\n' +
                    'bar,55-64,female,1869900,91400,0.04887961923097492,0.6762789384507033,135151.3329830876\n' +
                    'bar,65+,female,1869900,57900,0.030964222685705117,0.6556426806357079,88310.29722448888\n' +
                    'bar,65+,male,1869900,43600,0.0233167549066795,1.3759500070623052,31687.197773331398\n' +
                    'foo,18-24,male,6774700,1676800,0.24750911479475107,3.454893574450496,485340.565162473\n' +
                    'foo,18-24,female,6774700,563600,0.08319187565501056,0.7312988491670335,770683.5593163501\n' +
                    'foo,25-34,male,6774700,1429200,0.21096137098321696,1.9434471433971343,735394.3249013537\n' +
                    'foo,25-34,female,6774700,604000,0.08915523934639172,0.5318341579760985,1135692.378801936\n' +
                    'foo,35-44,male,6774700,782200,0.11545898711382054,1.5478909705064439,505332.74946624786\n' +
                    'foo,35-44,female,6774700,464200,0.06851963924601827,0.4955404564743767,936754.999385207\n' +
                    'foo,45-54,male,6774700,415100,0.06127208584881987,1.1712525795130928,354406.90356691746\n' +
                    'foo,45-54,female,6774700,301500,0.04450381566711441,0.41044905705110535,734561.3172220298\n' +
                    'foo,55-64,male,6774700,168800,0.024916232453097552,0.8786090151701065,192121.8620404422\n' +
                    'foo,55-64,female,6774700,160500,0.02369108595214548,0.32778042690456033,489657.05950078805\n' +
                    'foo,65+,male,6774700,112400,0.01659114056710998,0.9790633418695422,114803.60380501\n' +
                    'foo,65+,female,6774700,96400,0.014229412372503579,0.30129644029740654,319950.6768312449\n');
            });

    });




    describe("Probability calculation", function(){

        it('should calculate a probability for each author count', function() {

            let p = baseline._calcAuthProbability(stats);

            expect(p).to.deep.equal(stats);

            expect(p.baseline['25-34'].female.probability).to.deep.equal(p.baseline['25-34'].female.unique_authors / stats.baseline.total_unique_authors);

        });

    });


});