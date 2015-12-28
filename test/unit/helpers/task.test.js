"use strict";
process.env.NODE_ENV = 'test';

const taskHelper = require('../../../lib/helpers/task');

const chai = require("chai");

const expect = chai.expect;


describe("Task helper", function(){

    it( 'successfully overrides index creds from config - native nested', function() {
        let task = {
            "index": "example",
            "target": "fb.author.region",
            "threshold": 2,
            "child": {
                "target": "fb.author.age",
                "threshold": 2,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 2
                }
            }
        };

        let reqObj={
            "method": "POST",
            "auth": {
                "user": false,
                "pass": false
            },
            "uri": "https://api.datasift.com/v1/pylon/analyze",
            "json": {
                "hash": false,
                "start": 1448557724,
                "end": 1451322524,
                "parameters": {
                    "analysis_type": "freqDist",
                    "parameters": {
                        "index": "bar",
                        "id": "booboo",
                        "target": "fb.author.region",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.age",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.gender",
                                "threshold": 2
                            }
                        }
                    }
                }
            }
        };

        let out = taskHelper.getIndexCreds(task, reqObj);

        expect(out.auth.user).to.be.true;
        expect(out.auth.pass).to.be.true;
        expect(out.json.hash).to.be.true;
        expect(out.json.parameters.parameters.index).to.be.undefined;

        expect(out.json.parameters).to.exist;
        expect(out.json.parameters.parameters).to.exist;
        expect(out.json.parameters.parameters.child).to.exist;
        expect(out.json.parameters.parameters.child.child).to.exist;

    });

});
