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
                expect(result).to.eql('key,interactions,unique_authors\n' +
                    'male,10100300,6022000\n' +
                    'female,3271000,2674400\n');
            });
        });



        it('native nested - 1 level', function() {

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
                expect(result).to.eql('category,key,interactions,unique_authors\n' +
                    '"São Paulo",25-34,134300,85800\n' +
                    '"São Paulo",18-24,111300,81500\n' +
                    '"England",25-34,110900,81800\n' +
                    '"England",18-24,88800,68800\n');
            });
        });
        


        it('native nested - 2 level', function() {

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
                expect(result).to.eql('id,category,key,interactions,unique_authors\n' +
                    '"England","25-34",male,204200,116600\n' +
                    '"England","25-34",female,66400,52100\n' +
                    '"England","18-24",male,162000,90200\n' +
                    '"England","18-24",female,53600,41700\n' +
                    '"Texas","25-34",male,171600,85600\n' +
                    '"Texas","25-34",female,89200,71500\n' +
                    '"Texas","18-24",male,155900,65000\n' +
                    '"Texas","18-24",female,63200,48900\n');
            });
        });
        


        it('native nested merged - 1 level', function() {

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
                expect(result).to.eql('category,key,interactions,unique_authors\n' +
                    '"yogi","25-34",female,2476400,2019500\n' +
                    '"yogi","25-34",male,1551000,1145000\n' +
                    '"yogi","35-44",female,2020200,1481400\n' +
                    '"yogi","35-44",male,1109800,843100\n' +
                    '"yogi","18-24",female,1577300,1186700\n' +
                    '"yogi","18-24",male,1020000,732900\n' +
                    '"yogi","45-54",female,1590200,1160600\n' +
                    '"yogi","45-54",male,797100,574300\n' +
                    '"yogi","55-64",female,1103100,798400\n' +
                    '"yogi","55-64",male,461900,342800\n' +
                    '"yogi","65+",female,704900,524800\n' +
                    '"yogi","65+",male,295900,215200\n' +
                    '"booboo","25-34",female,900,900\n' +
                    '"booboo","25-34",male,700,700\n' +
                    '"booboo","35-44",female,600,500\n' +
                    '"booboo","35-44",male,400,400\n' +
                    '"booboo","45-54",female,400,400\n' +
                    '"booboo","45-54",male,200,200\n' +
                    '"booboo","18-24",female,400,300\n' +
                    '"booboo","18-24",male,200,200\n' +
                    '"booboo","55-64",female,100,100\n' +
                    '"booboo","55-64",male,100,100\n' +
                    '"booboo","65+",female,100,100\n');
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
                expect(result).to.eql('id,category,key,interactions,unique_authors\n' +
                    '"yogi","California","female",25-34,199400,157000\n' +
                    '"yogi","California","female",35-44,156900,131800\n' +
                    '"yogi","California","male",25-34,162000,123400\n' +
                    '"yogi","California","male",35-44,104500,79500\n' +
                    '"yogi","England","female",25-34,170600,138000\n' +
                    '"yogi","England","female",18-24,139100,117600\n' +
                    '"yogi","England","male",25-34,132000,105000\n' +
                    '"yogi","England","male",18-24,98100,78300\n' +
                    '"booboo","California","female",25-34,199400,157000\n' +
                    '"booboo","California","female",35-44,156900,131800\n' +
                    '"booboo","California","male",25-34,162000,123400\n' +
                    '"booboo","California","male",35-44,104500,79500\n' +
                    '"booboo","England","female",25-34,170600,138000\n' +
                    '"booboo","England","female",18-24,139100,117600\n' +
                    '"booboo","England","male",25-34,132000,105000\n' +
                    '"booboo","England","male",18-24,98100,78300\n');
            });
        });



        it('custom nested - 1 level', function() {

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
                ]
                ;

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('category,key,interactions,unique_authors\n' +
                    '"viralfeeds.biz",http://viralfeeds.biz/url2/v10,429900,147500\n' +
                    '"bit.ly",http://bit.ly/1pQ4wmf,25500,25500\n' +
                    '"bit.ly",http://bit.ly/22DMFjE,13200,13200\n');
            });
        });



        it('custom nested - 2 level', function() {

            let config =  [
                    {
                        "reshare__nzn.me": [
                            {
                                "key": "BMW",
                                "interactions": 108100,
                                "unique_authors": 108100
                            },
                            {
                                "key": "Pará",
                                "interactions": 108100,
                                "unique_authors": 108100
                            }
                        ],
                        "reshare__bit.ly": [
                            {
                                "key": "BMW",
                                "interactions": 2700,
                                "unique_authors": 2400
                            },
                            {
                                "key": "Ford Motor Company",
                                "interactions": 1900,
                                "unique_authors": 1800
                            }
                        ],
                        "like__viralfeeds.biz": [
                            {
                                "key": "BMW",
                                "interactions": 429800,
                                "unique_authors": 147500
                            }
                        ],
                        "like__bit.ly": [
                            {
                                "key": "BMW",
                                "interactions": 97100,
                                "unique_authors": 93400
                            },
                            {
                                "key": "Credit card",
                                "interactions": 49100,
                                "unique_authors": 48500
                            }
                        ]
                    }
                ];

            return format.jsonToCsv(config).then(function(result){

                expect(result).to.be.an('string');
                expect(result).to.eql('category,key,interactions,unique_authors\n' +
                    '"reshare__nzn.me",BMW,108100,108100\n' +
                    '"reshare__nzn.me",Pará,108100,108100\n' +
                    '"reshare__bit.ly",BMW,2700,2400\n' +
                    '"reshare__bit.ly",Ford Motor Company,1900,1800\n' +
                    '"like__viralfeeds.biz",BMW,429800,147500\n' +
                    '"like__bit.ly",BMW,97100,93400\n' +
                    '"like__bit.ly",Credit card,49100,48500\n');
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
                expect(result).to.eql('category,key,interactions,unique_authors\n' +
                    '"Turkey__sahibinden.com__Cars",like,1500,1500\n' +
                    '"Turkey__sahibinden.com__Cars",comment,100,100\n' +
                    '"United States__youtu.be__Cars",like,1100,1100\n' +
                    '"United States__youtu.be__Cars",comment,600,400\n' +
                    '"United States__youtube.com__Cars",like,1200,1200\n' +
                    '"United States__youtube.com__Cars",comment,500,400\n');
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
                expect(result).to.eql('key,interactions,unique_authors\n' +
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
                expect(result).to.eql('category,key,interactions,unique_authors' +
                    '\n"2016-04-01 00:00:00__like",BMW,4518700,3410200\n' +
                    '"2016-04-01 00:00:00__like",Ford Mustang,803100,571800\n' +
                    '"2016-04-01 00:00:00__reshare",BMW,1327300,1230900\n' +
                    '"2016-04-01 00:00:00__reshare",Pará,272100,258100\n' +
                    '"2016-03-01 00:00:00__like",BMW,4518700,3410200\n' +
                    '"2016-03-01 00:00:00__like",Ford Mustang,803100,571800\n' +
                    '"2016-03-01 00:00:00__reshare",BMW,1327300,1230900\n' +
                    '"2016-03-01 00:00:00__reshare",Pará,272100,258100\n');
            });
        });



    });

    
});



