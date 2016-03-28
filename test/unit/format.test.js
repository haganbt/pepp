"use strict";
process.env.NODE_ENV = 'test';
process.env.FORMAT = "csv";

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const format = require('../../lib/format');


describe.skip("Format - JSON to CSV", function(){

    it('Merged native nested', function() {

        let config =   [
            {
                "uber__25-34": [
                    {
                        "key": "female",
                        "interactions": 1707500,
                        "unique_authors": 1348100
                    },
                    {
                        "key": "male",
                        "interactions": 1388700,
                        "unique_authors": 1086300
                    }
                ],
                "uber__18-24": [
                    {
                        "key": "female",
                        "interactions": 1073000,
                        "unique_authors": 880400
                    },
                    {
                        "key": "male",
                        "interactions": 963000,
                        "unique_authors": 769500
                    }
                ],
                "uber__35-44": [
                    {
                        "key": "female",
                        "interactions": 1159700,
                        "unique_authors": 908300
                    },
                    {
                        "key": "male",
                        "interactions": 817000,
                        "unique_authors": 574100
                    }
                ],
                "uber__45-54": [
                    {
                        "key": "female",
                        "interactions": 783000,
                        "unique_authors": 596800
                    },
                    {
                        "key": "male",
                        "interactions": 493800,
                        "unique_authors": 356300
                    }
                ],
                "uber__55-64": [
                    {
                        "key": "female",
                        "interactions": 438500,
                        "unique_authors": 334100
                    },
                    {
                        "key": "male",
                        "interactions": 238600,
                        "unique_authors": 174300
                    }
                ],
                "uber__65+": [
                    {
                        "key": "female",
                        "interactions": 270500,
                        "unique_authors": 209200
                    },
                    {
                        "key": "male",
                        "interactions": 158600,
                        "unique_authors": 115000
                    }
                ],
                "baseline__18-24": [
                    {
                        "key": "female",
                        "interactions": 3074000,
                        "unique_authors": 2934000
                    },
                    {
                        "key": "male",
                        "interactions": 2995100,
                        "unique_authors": 2834100
                    }
                ],
                "baseline__25-34": [
                    {
                        "key": "female",
                        "interactions": 2297900,
                        "unique_authors": 2081800
                    },
                    {
                        "key": "male",
                        "interactions": 2152600,
                        "unique_authors": 2052300
                    }
                ],
                "baseline__35-44": [
                    {
                        "key": "female",
                        "interactions": 1448700,
                        "unique_authors": 1282400
                    },
                    {
                        "key": "male",
                        "interactions": 1032800,
                        "unique_authors": 941100
                    }
                ],
                "baseline__45-54": [
                    {
                        "key": "female",
                        "interactions": 921800,
                        "unique_authors": 819800
                    },
                    {
                        "key": "male",
                        "interactions": 546300,
                        "unique_authors": 507000
                    }
                ],
                "baseline__55-64": [
                    {
                        "key": "female",
                        "interactions": 519100,
                        "unique_authors": 470800
                    },
                    {
                        "key": "male",
                        "interactions": 255200,
                        "unique_authors": 234900
                    }
                ],
                "baseline__65+": [
                    {
                        "key": "female",
                        "interactions": 289700,
                        "unique_authors": 257300
                    },
                    {
                        "key": "male",
                        "interactions": 176500,
                        "unique_authors": 159100
                    }
                ]
            }
        ];

        return format.jsonToCsv(config).then(function(result){

            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,interactions,unique_authors\n' +
                '"uber__25-34",female,1707500,1348100\n' +
                '"uber__25-34",male,1388700,1086300\n' +
                '"uber__18-24",female,1073000,880400\n' +
                '"uber__18-24",male,963000,769500\n' +
                '"uber__35-44",female,1159700,908300\n' +
                '"uber__35-44",male,817000,574100\n' +
                '"uber__45-54",female,783000,596800\n' +
                '"uber__45-54",male,493800,356300\n' +
                '"uber__55-64",female,438500,334100\n' +
                '"uber__55-64",male,238600,174300\n' +
                '"uber__65+",female,270500,209200\n' +
                '"uber__65+",male,158600,115000\n' +
                '"baseline__18-24",female,3074000,2934000\n' +
                '"baseline__18-24",male,2995100,2834100\n' +
                '"baseline__25-34",female,2297900,2081800\n' +
                '"baseline__25-34",male,2152600,2052300\n' +
                '"baseline__35-44",female,1448700,1282400\n' +
                '"baseline__35-44",male,1032800,941100\n' +
                '"baseline__45-54",female,921800,819800\n' +
                '"baseline__45-54",male,546300,507000\n' +
                '"baseline__55-64",female,519100,470800\n' +
                '"baseline__55-64",male,255200,234900\n' +
                '"baseline__65+",female,289700,257300\n' +
                '"baseline__65+",male,176500,159100\n');
        });
    });

    it('single FD response', function() {

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
            expect(result).to.eql('key,interactions,unique_authors\nmale,10100300,6022000\nfemale,3271000,2674400\n');
        });
    });

    it('custom nested - child array format', function() {

        let config = [
                {
                    "booboo-1451606400-male": [
                        {
                            "key": "25-34",
                            "interactions": 1628600,
                            "unique_authors": 914000
                        },
                        {
                            "key": "18-24",
                            "interactions": 1454700,
                            "unique_authors": 695800
                        }
                    ],
                    "yogi-1448928000-female": [
                        {
                            "key": "25-34",
                            "interactions": 2955400,
                            "unique_authors": 2411600
                        },
                        {
                            "key": "35-44",
                            "interactions": 2620300,
                            "unique_authors": 1987500
                        }
                    ],
                    "yogi-1448928000-male": [
                        {
                            "key": "25-34",
                            "interactions": 2109900,
                            "unique_authors": 1533100
                        },
                        {
                            "key": "35-44",
                            "interactions": 1618500,
                            "unique_authors": 1157100
                        }
                    ]
                }];

        return format.jsonToCsv(config).then(function(result){

            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,interactions,unique_authors\n' +
                '"booboo-1451606400-male",25-34,1628600,914000\n' +
                '"booboo-1451606400-male",18-24,1454700,695800\n' +
                '"yogi-1448928000-female",25-34,2955400,2411600\n' +
                '"yogi-1448928000-female",35-44,2620300,1987500\n' +
                '"yogi-1448928000-male",25-34,2109900,1533100\n' +
                '"yogi-1448928000-male",35-44,1618500,1157100\n');
        });
    });

    it('non nested - child array format', function() {

        let config = [
            {
                "25-34": [
                    {
                        "key": 1448841600,
                        "interactions": 280300,
                        "unique_authors": 220300
                    },
                    {
                        "key": 1449446400,
                        "interactions": 575300,
                        "unique_authors": 402400
                    }
                ],
                "18-24": [
                    {
                        "key": 1448841600,
                        "interactions": 259900,
                        "unique_authors": 188600
                    },
                    {
                        "key": 1449446400,
                        "interactions": 443900,
                        "unique_authors": 300400
                    }
                ]
            }
        ];


        return format.jsonToCsv(config).then(function(result){

            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,interactions,unique_authors\n' +
                '"25-34",1448841600,280300,220300\n' +
                '"25-34",1449446400,575300,402400\n' +
                '"18-24",1448841600,259900,188600\n' +
                '"18-24",1449446400,443900,300400\n');
        });
    });

    it('native nested child array format', function() {

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
            expect(result).to.eql('"England","25-34","male",204200,116600\n' +
                '"England","25-34","female",66400,52100\n' +
                '"England","18-24","male",162000,90200\n' +
                '"England","18-24","female",53600,41700\n' +
                '"Texas","25-34","male",171600,85600\n' +
                '"Texas","25-34","female",89200,71500\n' +
                '"Texas","18-24","male",155900,65000\n' +
                '"Texas","18-24","female",63200,48900\n');
        });
    });


    /*

    yogi, 25-34, 4053400, 3147000, female, 400, 400,
    yogi, 25-34, 4053400, 3147000, male, 200, 200

     */
    it('native nested marged', function() {

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
            //expect(result).to.eql('foo');
        });
    });
});



