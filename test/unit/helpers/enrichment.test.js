"use strict";
process.env.NODE_ENV = 'test';

const enrichment = require('../../../lib/helpers/enrichment');

const chai = require("chai");

let expect = chai.expect;


var example = {
    "interactions": 9518300,
    "unique_authors": 5771000,
    "analysis": {
        "analysis_type": "freqDist",
        "parameters": {
            "target": "fb.author.region",
            "threshold": 2
        },
        "results": [
            {
                "key": "England",
                "interactions": 1000100,
                "unique_authors": 614200,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.age",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "25-34",
                            "interactions": 283400,
                            "unique_authors": 168000,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "male",
                                        "interactions": 214800,
                                        "unique_authors": 119100
                                    },
                                    {
                                        "key": "female",
                                        "interactions": 67200,
                                        "unique_authors": 51500
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "18-24",
                            "interactions": 231900,
                            "unique_authors": 139300,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "male",
                                        "interactions": 175800,
                                        "unique_authors": 97500
                                    },
                                    {
                                        "key": "female",
                                        "interactions": 55700,
                                        "unique_authors": 42800
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
                "interactions": 933500,
                "unique_authors": 541400,
                "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "target": "fb.author.age",
                        "threshold": 2
                    },
                    "results": [
                        {
                            "key": "25-34",
                            "interactions": 266900,
                            "unique_authors": 167100,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "male",
                                        "interactions": 174500,
                                        "unique_authors": 87700
                                    },
                                    {
                                        "key": "female",
                                        "interactions": 91600,
                                        "unique_authors": 71500
                                    }
                                ],
                                "redacted": false
                            }
                        },
                        {
                            "key": "18-24",
                            "interactions": 220900,
                            "unique_authors": 110000,
                            "child": {
                                "analysis_type": "freqDist",
                                "parameters": {
                                    "target": "fb.author.gender",
                                    "threshold": 2
                                },
                                "results": [
                                    {
                                        "key": "male",
                                        "interactions": 160800,
                                        "unique_authors": 65400
                                    },
                                    {
                                        "key": "female",
                                        "interactions": 59800,
                                        "unique_authors": 46800
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
        "redacted": false
    }
};



describe("Enrichment Helper", function(){

    it( 'should add percentages - native nested response', function() {

        let result = enrichment.addPercentages(example);

        expect(result.analysis.results[0]).to.have.all.keys(["child", "key", "interactions", "interactions_per", "unique_authors", "unique_authors_per"]);
        expect(result.analysis.results[0].child.results[0]).to.have.all.keys(["child", "key", "interactions", "interactions_per", "unique_authors", "unique_authors_per"]);
        expect(result.analysis.results[0].child.results[0].child.results[0]).to.have.all.keys(["key", "interactions", "interactions_per", "unique_authors", "unique_authors_per"]);

    });

});
