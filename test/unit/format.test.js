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

    it.only('single FD response', function() {

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

});
