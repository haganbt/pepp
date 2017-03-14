"use strict";
process.env.NODE_ENV = 'test';
process.env.FORMAT = "csv";

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const format = require('../../lib/format');


describe("Format - JSON to CSV", function(){

    describe("freqDist", function(){


        it('Single Task', function() {

            let config =  [
                {
                    "key": "male",
                    "interactions": 10100300,
                    "unique_authors": 6022000
                },
                {
                    "key": "female",
                    "interactions": 3271000,
                    "unique_authors": 2674400
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,interactions,unique_authors\n' +
                    'male,10100300,6022000\n' +
                    'female,3271000,2674400\n');
            });
        });


        it('native nested - 2 level', function() {

            let config = [
                    {
                        "key": "São Paulo",
                        "interactions": 429200,
                        "unique_authors": 291700,
                        "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                                "target": "fb.author.age",
                                "threshold": 2
                            },
                            "results": [
                                {
                                    "key": "25-34",
                                    "interactions": 134300,
                                    "unique_authors": 85800
                                },
                                {
                                    "key": "18-24",
                                    "interactions": 111300,
                                    "unique_authors": 81500
                                }
                            ],
                            "redacted": false
                        }
                    },
                    {
                        "key": "England",
                        "interactions": 366700,
                        "unique_authors": 265900,
                        "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                                "target": "fb.author.age",
                                "threshold": 2
                            },
                            "results": [
                                {
                                    "key": "25-34",
                                    "interactions": 110900,
                                    "unique_authors": 81800
                                },
                                {
                                    "key": "18-24",
                                    "interactions": 88800,
                                    "unique_authors": 68800
                                }
                            ],
                            "redacted": false
                        }
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,interactions,unique_authors\n' +
                    'São Paulo,25-34,134300,85800\n' +
                    'São Paulo,18-24,111300,81500\n' +
                    'England,25-34,110900,81800\n' +
                    'England,18-24,88800,68800\n');
            });
        });


        it.only('native nested - 3 level', function() {

            let config = [
                {
                    "key": "England",
                    "interactions": 936900,
                    "unique_authors": 601300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 271900,
                                "unique_authors": 167700,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 204200,
                                            "unique_authors": 116600
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 66400,
                                            "unique_authors": 52100
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "18-24",
                                "interactions": 216000,
                                "unique_authors": 133000,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 162000,
                                            "unique_authors": 90200
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 53600,
                                            "unique_authors": 41700
                                        }
                                    ],
                                    "redacted": false
                                }
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "Texas",
                    "interactions": 921500,
                    "unique_authors": 509700,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 2
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 261600,
                                "unique_authors": 161900,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 171600,
                                            "unique_authors": 85600
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 89200,
                                            "unique_authors": 71500
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "18-24",
                                "interactions": 219500,
                                "unique_authors": 111600,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 155900,
                                            "unique_authors": 65000
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 63200,
                                            "unique_authors": 48900
                                        }
                                    ],
                                    "redacted": false
                                }
                            }
                        ],
                        "redacted": false
                    }
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('interactions,unique_authors\nEngland,936900,25-34,271900,male,204200\nEngland,936900,25-34,271900,female,66400\nEngland,936900,18-24,216000,male,162000\nEngland,936900,18-24,216000,female,53600\nTexas,921500,25-34,261600,male,171600\nTexas,921500,25-34,261600,female,89200\nTexas,921500,18-24,219500,male,155900\nTexas,921500,18-24,219500,female,63200\n');
            });
        });


        it.only('native nested merged - 1 level', function() {

            let config = [
                {
                    "yogi": [
                        {
                            "key": "25-34",
                            "interactions": 4053400,
                            "unique_authors": 3147000,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 2476400,
                                        "unique_authors": 2019500
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 1551000,
                                        "unique_authors": 1145000
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "35-44",
                            "interactions": 3149000,
                            "unique_authors": 2312800,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 2020200,
                                        "unique_authors": 1481400
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 1109800,
                                        "unique_authors": 843100
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "18-24",
                            "interactions": 2613800,
                            "unique_authors": 1970300,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 1577300,
                                        "unique_authors": 1186700
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 1020000,
                                        "unique_authors": 732900
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "45-54",
                            "interactions": 2402200,
                            "unique_authors": 1742200,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 1590200,
                                        "unique_authors": 1160600
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 797100,
                                        "unique_authors": 574300
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "55-64",
                            "interactions": 1575800,
                            "unique_authors": 1082400,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 1103100,
                                        "unique_authors": 798400
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 461900,
                                        "unique_authors": 342800
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "65+",
                            "interactions": 1009300,
                            "unique_authors": 743200,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 704900,
                                        "unique_authors": 524800
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 295900,
                                        "unique_authors": 215200
                                    }
                                ],
                                "redacted": false
                            }
                        }
                    ],
                    "booboo": [
                        {
                            "key": "25-34",
                            "interactions": 1700,
                            "unique_authors": 1600,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 900,
                                        "unique_authors": 900
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 700,
                                        "unique_authors": 700
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "35-44",
                            "interactions": 1000,
                            "unique_authors": 900,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 600,
                                        "unique_authors": 500
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 400,
                                        "unique_authors": 400
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "45-54",
                            "interactions": 600,
                            "unique_authors": 600,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 400,
                                        "unique_authors": 400
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 200,
                                        "unique_authors": 200
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "18-24",
                            "interactions": 600,
                            "unique_authors": 600,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 400,
                                        "unique_authors": 300
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 200,
                                        "unique_authors": 200
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "55-64",
                            "interactions": 300,
                            "unique_authors": 300,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 100,
                                        "unique_authors": 100
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 100,
                                        "unique_authors": 100
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "65+",
                            "interactions": 200,
                            "unique_authors": 100,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 100,
                                        "unique_authors": 100
                                    }
                                ],
                                "redacted": false
                            }
                        }
                    ]
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('interactions,unique_authors\nyogi,25-34,4053400,female,2476400\nyogi,25-34,4053400,male,1551000\nyogi,35-44,3149000,female,2020200\nyogi,35-44,3149000,male,1109800\nyogi,18-24,2613800,female,1577300\nyogi,18-24,2613800,male,1020000\nyogi,45-54,2402200,female,1590200\nyogi,45-54,2402200,male,797100\nyogi,55-64,1575800,female,1103100\nyogi,55-64,1575800,male,461900\nyogi,65+,1009300,female,704900\nyogi,65+,1009300,male,295900\nbooboo,25-34,1700,female,900\nbooboo,25-34,1700,male,700\nbooboo,35-44,1000,female,600\nbooboo,35-44,1000,male,400\nbooboo,45-54,600,female,400\nbooboo,45-54,600,male,200\nbooboo,18-24,600,female,400\nbooboo,18-24,600,male,200\nbooboo,55-64,300,female,100\nbooboo,55-64,300,male,100\nbooboo,65+,200,female,100\n');
            });
        });


        it('native nested merged - 2 level', function() {

            let config = [
                {
                    "yogi": [
                        {
                            "key": "California",
                            "interactions": 1247600,
                            "unique_authors": 957000,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 731400,
                                        "unique_authors": 599200,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 199400,
                                                    "unique_authors": 157000
                                                },
                                                {
                                                    "key": "35-44",
                                                    "interactions": 156900,
                                                    "unique_authors": 131800
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 507400,
                                        "unique_authors": 382200,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 162000,
                                                    "unique_authors": 123400
                                                },
                                                {
                                                    "key": "35-44",
                                                    "interactions": 104500,
                                                    "unique_authors": 79500
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "England",
                            "interactions": 1070200,
                            "unique_authors": 871300,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 631700,
                                        "unique_authors": 528300,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 170600,
                                                    "unique_authors": 138000
                                                },
                                                {
                                                    "key": "18-24",
                                                    "interactions": 139100,
                                                    "unique_authors": 117600
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 429100,
                                        "unique_authors": 327500,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 132000,
                                                    "unique_authors": 105000
                                                },
                                                {
                                                    "key": "18-24",
                                                    "interactions": 98100,
                                                    "unique_authors": 78300
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    }
                                ],
                                "redacted": false
                            }
                        }
                    ],
                    "booboo": [
                        {
                            "key": "California",
                            "interactions": 1247600,
                            "unique_authors": 957000,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 731400,
                                        "unique_authors": 599200,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 199400,
                                                    "unique_authors": 157000
                                                },
                                                {
                                                    "key": "35-44",
                                                    "interactions": 156900,
                                                    "unique_authors": 131800
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 507400,
                                        "unique_authors": 382200,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 162000,
                                                    "unique_authors": 123400
                                                },
                                                {
                                                    "key": "35-44",
                                                    "interactions": 104500,
                                                    "unique_authors": 79500
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "England",
                            "interactions": 1070200,
                            "unique_authors": 871300,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "female",
                                        "interactions": 631700,
                                        "unique_authors": 528300,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 170600,
                                                    "unique_authors": 138000
                                                },
                                                {
                                                    "key": "18-24",
                                                    "interactions": 139100,
                                                    "unique_authors": 117600
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    },
                                    {
                                        "key": "male",
                                        "interactions": 429100,
                                        "unique_authors": 327500,
                                        "child": {
                                            "analysis_type": "freqDist",
                                            "parameters": {
                                                "target": "fb.author.age",
                                                "threshold": 2
                                            },
                                            "results": [
                                                {
                                                    "key": "25-34",
                                                    "interactions": 132000,
                                                    "unique_authors": 105000
                                                },
                                                {
                                                    "key": "18-24",
                                                    "interactions": 98100,
                                                    "unique_authors": 78300
                                                }
                                            ],
                                            "redacted": false
                                        }
                                    }
                                ],
                                "redacted": false
                            }
                        }
                    ]
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.a('string');
                expect(result).to.eql('key1,key2,key3,key4,interactions,unique_authors\n' +
                    'yogi,California,female,25-34,199400,157000\n' +
                    'yogi,California,female,35-44,156900,131800\n' +
                    'yogi,California,male,25-34,162000,123400\n' +
                    'yogi,California,male,35-44,104500,79500\n' +
                    'yogi,England,female,25-34,170600,138000\n' +
                    'yogi,England,female,18-24,139100,117600\n' +
                    'yogi,England,male,25-34,132000,105000\n' +
                    'yogi,England,male,18-24,98100,78300\n' +
                    'booboo,California,female,25-34,199400,157000\n' +
                    'booboo,California,female,35-44,156900,131800\n' +
                    'booboo,California,male,25-34,162000,123400\n' +
                    'booboo,California,male,35-44,104500,79500\n' +
                    'booboo,England,female,25-34,170600,138000\n' +
                    'booboo,England,female,18-24,139100,117600\n' +
                    'booboo,England,male,25-34,132000,105000\n' +
                    'booboo,England,male,18-24,98100,78300\n');
            });
        });


        it('native nested merged - 2 level - empty result sets', function() {

            // note empty results - "key": "55-64",
            let config =  [
                {
                    "key": "youtube.com",
                    "interactions": 35300,
                    "unique_authors": 31100,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.parent.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 7200,
                                "unique_authors": 6100,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 5800,
                                            "unique_authors": 4900
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 1300,
                                            "unique_authors": 1000
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "18-24",
                                "interactions": 5600,
                                "unique_authors": 4500,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 4600,
                                            "unique_authors": 3700
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 1000,
                                            "unique_authors": 700
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "35-44",
                                "interactions": 2500,
                                "unique_authors": 2100,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 1800,
                                            "unique_authors": 1500
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 600,
                                            "unique_authors": 500
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "45-54",
                                "interactions": 800,
                                "unique_authors": 600,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "male",
                                            "interactions": 400,
                                            "unique_authors": 300
                                        },
                                        {
                                            "key": "female",
                                            "interactions": 300,
                                            "unique_authors": 300
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "65+",
                                "interactions": 300,
                                "unique_authors": 200,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [
                                        {
                                            "key": "female",
                                            "interactions": 100,
                                            "unique_authors": 100
                                        },
                                        {
                                            "key": "male",
                                            "interactions": 100,
                                            "unique_authors": 100
                                        }
                                    ],
                                    "redacted": false
                                }
                            },
                            {
                                "key": "55-64",
                                "interactions": 100,
                                "unique_authors": 100,
                                "child": {
                                    "analysis_type": "freqDist",
                                    "parameters": {
                                        "target": "fb.parent.author.gender",
                                        "threshold": 2
                                    },
                                    "results": [],
                                    "redacted": false
                                }
                            }
                        ],
                        "redacted": false
                    }
                }
            ];

            return format.jsonToCsv(config).then(function(result){
                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,key3,interactions,unique_authors\n' +
                    'youtube.com,25-34,male,5800,4900\n' +
                    'youtube.com,25-34,female,1300,1000\n' +
                    'youtube.com,18-24,male,4600,3700\n' +
                    'youtube.com,18-24,female,1000,700\n' +
                    'youtube.com,35-44,male,1800,1500\n' +
                    'youtube.com,35-44,female,600,500\n' +
                    'youtube.com,45-54,male,400,300\n' +
                    'youtube.com,45-54,female,300,300\n' +
                    'youtube.com,65+,female,100,100\n' +
                    'youtube.com,65+,male,100,100\n');
            });
        });


        it('custom nested merged - 1 level', function() {

            let config =  [
                    {
                        "viralfeeds.biz": [
                            {
                                "key": "http://viralfeeds.biz/url2/v10",
                                "interactions": 429900,
                                "unique_authors": 147500
                            }
                        ],
                        "bit.ly": [
                            {
                                "key": "http://bit.ly/1pQ4wmf",
                                "interactions": 25500,
                                "unique_authors": 25500
                            },
                            {
                                "key": "http://bit.ly/22DMFjE",
                                "interactions": 13200,
                                "unique_authors": 13200
                            }
                        ]
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,interactions,unique_authors\n' +
                    'viralfeeds.biz,http://viralfeeds.biz/url2/v10,429900,147500\n' +
                    'bit.ly,http://bit.ly/1pQ4wmf,25500,25500\n' +
                    'bit.ly,http://bit.ly/22DMFjE,13200,13200\n');
            });
        });


        it('custom nested merged - 2 level', function() {

            let config =  [
                {
                    "India__35-44": [
                        {
                            "key": "Captain America",
                            "interactions": 48200,
                            "unique_authors": 44800
                        },
                        {
                            "key": "Civil War",
                            "interactions": 5400,
                            "unique_authors": 5100
                        }
                    ],
                    "India__45-54": [
                        {
                            "key": "Captain America",
                            "interactions": 5200,
                            "unique_authors": 4900
                        },
                        {
                            "key": "India",
                            "interactions": 2600,
                            "unique_authors": 1400
                        }
                    ],
                    "India__65+": [
                        {
                            "key": "Captain America",
                            "interactions": 8000,
                            "unique_authors": 7200
                        },
                        {
                            "key": "Civil War",
                            "interactions": 400,
                            "unique_authors": 300
                        }
                    ],
                    "India__55-64": [
                        {
                            "key": "Captain America",
                            "interactions": 900,
                            "unique_authors": 900
                        },
                        {
                            "key": "Civil war",
                            "interactions": 100,
                            "unique_authors": 100
                        }
                    ],
                    "United States__25-34": [
                        {
                            "key": "Captain America",
                            "interactions": 2626700,
                            "unique_authors": 1970500
                        },
                        {
                            "key": "Captain America: Civil ͏Wa͏r",
                            "interactions": 593400,
                            "unique_authors": 499800
                        }
                    ],
                    "United States__35-44": [
                        {
                            "key": "Captain America",
                            "interactions": 2077200,
                            "unique_authors": 1781300
                        },
                        {
                            "key": "Captain America: Civil ͏Wa͏r",
                            "interactions": 383400,
                            "unique_authors": 340100
                        }
                    ]
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,key3,interactions,unique_authors\n' +
                    'India,35-44,Captain America,48200,44800\n' +
                    'India,35-44,Civil War,5400,5100\n' +
                    'India,45-54,Captain America,5200,4900\n' +
                    'India,45-54,India,2600,1400\n' +
                    'India,65+,Captain America,8000,7200\n' +
                    'India,65+,Civil War,400,300\n' +
                    'India,55-64,Captain America,900,900\n' +
                    'India,55-64,Civil war,100,100\n' +
                    'United States,25-34,Captain America,2626700,1970500\n' +
                    'United States,25-34,Captain America: Civil ͏Wa͏r,593400,499800\n' +
                    'United States,35-44,Captain America,2077200,1781300\n' +
                    'United States,35-44,Captain America: Civil ͏Wa͏r,383400,340100\n');
            });
        });


        it('custom nested - 2 level', function() {

            let config =  [
                    {
                        "Media/News/Publishing": [
                            {
                                "key": "http://bit.ly/1rFFkPW",
                                "interactions": 17800,
                                "unique_authors": 17400
                            },
                            {
                                "key": "http://bit.ly/1olFbiq",
                                "interactions": 16700,
                                "unique_authors": 13100
                            }
                        ],
                        "News/Media": [
                            {
                                "key": "https://www.yaklai.com/entertainment/kellytanapat-ninechanuchtra/",
                                "interactions": 10800,
                                "unique_authors": 10400
                            },
                            {
                                "key": "https://www.yaklai.com/lifestyle/special-article/lose-life-forest-fire-in-thailand/",
                                "interactions": 6200,
                                "unique_authors": 6000
                            }
                        ]
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,interactions,unique_authors\n' +
                    'Media/News/Publishing,http://bit.ly/1rFFkPW,17800,17400\n' +
                    'Media/News/Publishing,http://bit.ly/1olFbiq,16700,13100\n' +
                    'News/Media,https://www.yaklai.com/entertainment/kellytanapat-ninechanuchtra/,10800,10400\n' +
                    'News/Media,https://www.yaklai.com/lifestyle/special-article/lose-life-forest-fire-in-thailand/,6200,6000\n');
            });
        });


        it('custom nested - 2 level - empty result set', function() {

            let config =   [
                    {
                        "United States__25-34": [
                            {
                                "key": "BMW",
                                "interactions": 55300,
                                "unique_authors": 51400
                            },
                            {
                                "key": "Honda Civic",
                                "interactions": 23900,
                                "unique_authors": 20600
                            }
                        ],
                        "United States__35-44": [
                            {
                                "key": "BMW",
                                "interactions": 34300,
                                "unique_authors": 29000
                            },
                            {
                                "key": "Cars",
                                "interactions": 14500,
                                "unique_authors": 12600
                            }
                        ],
                        "United States__18-24": [
                            {
                                "key": "BMW",
                                "interactions": 33400,
                                "unique_authors": 29000
                            },
                            {
                                "key": "Honda Civic",
                                "interactions": 18100,
                                "unique_authors": 16400
                            }
                        ],
                        "United States__45-54": [
                            {
                                "key": "BMW",
                                "interactions": 21000,
                                "unique_authors": 19000
                            },
                            {
                                "key": "Cars",
                                "interactions": 9200,
                                "unique_authors": 8600
                            }
                        ],
                        "United States__55-64": [
                            {
                                "key": "BMW",
                                "interactions": 9400,
                                "unique_authors": 8300
                            },
                            {
                                "key": "Cars",
                                "interactions": 4800,
                                "unique_authors": 4400
                            }
                        ],
                        "United States__65+": [
                            {
                                "key": "BMW",
                                "interactions": 4500,
                                "unique_authors": 3900
                            },
                            {
                                "key": "Cars",
                                "interactions": 2500,
                                "unique_authors": 2100
                            }
                        ],
                        "Turkey__25-34": [
                            {
                                "key": "BMW",
                                "interactions": 26700,
                                "unique_authors": 23700
                            },
                            {
                                "key": "Honda Civic",
                                "interactions": 3800,
                                "unique_authors": 3600
                            }
                        ],
                        "Turkey__18-24": [
                            {
                                "key": "BMW",
                                "interactions": 24700,
                                "unique_authors": 22900
                            },
                            {
                                "key": "Honda",
                                "interactions": 3600,
                                "unique_authors": 3500
                            }
                        ],
                        "Turkey__35-44": [
                            {
                                "key": "BMW",
                                "interactions": 7800,
                                "unique_authors": 6700
                            },
                            {
                                "key": "Honda Civic",
                                "interactions": 1100,
                                "unique_authors": 1000
                            }
                        ],
                        "Turkey__45-54": [
                            {
                                "key": "BMW",
                                "interactions": 2200,
                                "unique_authors": 2000
                            },
                            {
                                "key": "Audi USA",
                                "interactions": 200,
                                "unique_authors": 200
                            }
                        ],
                        "Turkey__65+": [],
                        "Turkey__55-64": []
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,key3,interactions,unique_authors\n' +
                    'United States,25-34,BMW,55300,51400\n' +
                    'United States,25-34,Honda Civic,23900,20600\n' +
                    'United States,35-44,BMW,34300,29000\n' +
                    'United States,35-44,Cars,14500,12600\n' +
                    'United States,18-24,BMW,33400,29000\n' +
                    'United States,18-24,Honda Civic,18100,16400\n' +
                    'United States,45-54,BMW,21000,19000\n' +
                    'United States,45-54,Cars,9200,8600\n' +
                    'United States,55-64,BMW,9400,8300\n' +
                    'United States,55-64,Cars,4800,4400\n' +
                    'United States,65+,BMW,4500,3900\n' +
                    'United States,65+,Cars,2500,2100\n' +
                    'Turkey,25-34,BMW,26700,23700\n' +
                    'Turkey,25-34,Honda Civic,3800,3600\n' +
                    'Turkey,18-24,BMW,24700,22900\n' +
                    'Turkey,18-24,Honda,3600,3500\n' +
                    'Turkey,35-44,BMW,7800,6700\n' +
                    'Turkey,35-44,Honda Civic,1100,1000\n' +
                    'Turkey,45-54,BMW,2200,2000\n' +
                    'Turkey,45-54,Audi USA,200,200\n');
            });
        });


        it('custom nested - 3 level', function() {

            let config =  [
                    {
                        "Turkey__sahibinden.com__Cars": [
                            {
                                "key": "like",
                                "interactions": 1500,
                                "unique_authors": 1500
                            },
                            {
                                "key": "comment",
                                "interactions": 100,
                                "unique_authors": 100
                            }
                        ],
                        "United States__youtu.be__Cars": [
                            {
                                "key": "like",
                                "interactions": 1100,
                                "unique_authors": 1100
                            },
                            {
                                "key": "comment",
                                "interactions": 600,
                                "unique_authors": 400
                            }
                        ],
                        "United States__youtube.com__Cars": [
                            {
                                "key": "like",
                                "interactions": 1200,
                                "unique_authors": 1200
                            },
                            {
                                "key": "comment",
                                "interactions": 500,
                                "unique_authors": 400
                            }
                        ]
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,key3,key4,interactions,unique_authors\n' +
                    'Turkey,sahibinden.com,Cars,like,1500,1500\n' +
                    'Turkey,sahibinden.com,Cars,comment,100,100\n' +
                    'United States,youtu.be,Cars,like,1100,1100\n' +
                    'United States,youtu.be,Cars,comment,600,400\n' +
                    'United States,youtube.com,Cars,like,1200,1200\n' +
                    'United States,youtube.com,Cars,comment,500,400\n');
            });
        });


    });



    describe("timeSeries", function(){

        it('Single Task', function() {

            let config =   [
                    {
                        "key": "2016-03-07 00:00:00",
                        "interactions": 490600,
                        "unique_authors": 432800
                    },
                    {
                        "key": "2016-03-08 00:00:00",
                        "interactions": 526300,
                        "unique_authors": 447700
                    },
                    {
                        "key": "2016-03-09 00:00:00",
                        "interactions": 666400,
                        "unique_authors": 596000
                    },
                    {
                        "key": "2016-03-10 00:00:00",
                        "interactions": 724600,
                        "unique_authors": 599100
                    },
                    {
                        "key": "2016-03-11 00:00:00",
                        "interactions": 683900,
                        "unique_authors": 599100
                    },
                    {
                        "key": "2016-03-12 00:00:00",
                        "interactions": 515200,
                        "unique_authors": 438500
                    },
                    {
                        "key": "2016-03-13 00:00:00",
                        "interactions": 690700,
                        "unique_authors": 608900
                    },
                    {
                        "key": "2016-03-14 00:00:00",
                        "interactions": 611200,
                        "unique_authors": 505000
                    },
                    {
                        "key": "2016-03-15 00:00:00",
                        "interactions": 410900,
                        "unique_authors": 355200
                    },
                    {
                        "key": "2016-03-16 00:00:00",
                        "interactions": 457700,
                        "unique_authors": 383200
                    },
                    {
                        "key": "2016-03-17 00:00:00",
                        "interactions": 414500,
                        "unique_authors": 367900
                    },
                    {
                        "key": "2016-03-18 00:00:00",
                        "interactions": 398700,
                        "unique_authors": 352800
                    }
                ]
                ;

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,interactions,unique_authors\n' +
                    '2016-03-07 00:00:00,490600,432800\n' +
                    '2016-03-08 00:00:00,526300,447700\n' +
                    '2016-03-09 00:00:00,666400,596000\n' +
                    '2016-03-10 00:00:00,724600,599100\n' +
                    '2016-03-11 00:00:00,683900,599100\n' +
                    '2016-03-12 00:00:00,515200,438500\n' +
                    '2016-03-13 00:00:00,690700,608900\n' +
                    '2016-03-14 00:00:00,611200,505000\n' +
                    '2016-03-15 00:00:00,410900,355200\n' +
                    '2016-03-16 00:00:00,457700,383200\n' +
                    '2016-03-17 00:00:00,414500,367900\n' +
                    '2016-03-18 00:00:00,398700,352800\n');
            });
        });

    });


    
    describe("Hybrid", function(){

        /*
        "timeSeries": [
            {
                "interval": "month",
                "then": {
                    "type": "freqDist",
                    "target": "fb.type",
                    "threshold": 2,
                    "then": {
                        "target": "fb.parent.topics.name",
                        "threshold": 2
                    }
                }
            },
         ]
          */
        it('TimeSeries - nested custom freqDist - 2 levels', function() {

            let config =   [
                {
                    "2016-04-01 00:00:00__like": [
                        {
                            "key": "BMW",
                            "interactions": 4518700,
                            "unique_authors": 3410200
                        },
                        {
                            "key": "Ford Mustang",
                            "interactions": 803100,
                            "unique_authors": 571800
                        }
                    ],
                    "2016-04-01 00:00:00__reshare": [
                        {
                            "key": "BMW",
                            "interactions": 1327300,
                            "unique_authors": 1230900
                        },
                        {
                            "key": "Pará",
                            "interactions": 272100,
                            "unique_authors": 258100
                        }
                    ],
                    "2016-03-01 00:00:00__like": [
                        {
                            "key": "BMW",
                            "interactions": 4518700,
                            "unique_authors": 3410200
                        },
                        {
                            "key": "Ford Mustang",
                            "interactions": 803100,
                            "unique_authors": 571800
                        }
                    ],
                    "2016-03-01 00:00:00__reshare": [
                        {
                            "key": "BMW",
                            "interactions": 1327300,
                            "unique_authors": 1230900
                        },
                        {
                            "key": "Pará",
                            "interactions": 272100,
                            "unique_authors": 258100
                        }
                    ]
                }
            ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('key1,key2,key3,interactions,unique_authors\n' +
                    '2016-04-01 00:00:00,like,BMW,4518700,3410200\n' +
                    '2016-04-01 00:00:00,like,Ford Mustang,803100,571800\n' +
                    '2016-04-01 00:00:00,reshare,BMW,1327300,1230900\n' +
                    '2016-04-01 00:00:00,reshare,Pará,272100,258100\n' +
                    '2016-03-01 00:00:00,like,BMW,4518700,3410200\n' +
                    '2016-03-01 00:00:00,like,Ford Mustang,803100,571800\n' +
                    '2016-03-01 00:00:00,reshare,BMW,1327300,1230900\n' +
                    '2016-03-01 00:00:00,reshare,Pará,272100,258100\n');
            });
        });

    });



    describe("Escaping Characters", function(){

        it('commas and pipes in strings', function() {

                let config =  [
                    {
                        "key": "m|ale",
                        "interactions": 10100300,
                        "unique_authors": 6022000
                    },
                    {
                        "key": "fem,ale",
                        "interactions": 3271000,
                        "unique_authors": 2674400
                    }
                ];

                return format.jsonToCsv(config).then(function(result){

                    expect(result).to.be.an('string');
                    expect(result).to.eql('key1,interactions,unique_authors\n' +
                        'm|ale,10100300,6022000\n' +
                        '"fem,ale",3271000,2674400\n');
                });
            });

    });

    
});



