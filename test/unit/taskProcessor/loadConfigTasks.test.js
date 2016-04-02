"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const taskProcessor = require('../../../lib/taskProcessor');

describe("loadConfigTasks", function(){

    it('should write "index" param to THEN object', function() {

        let config = {
            "freqDist": [
                {
                    "index": "foo",
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.type",
                        "threshold": 2
                    }
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        expect(configTasks[0].then.index).to.equal("foo");
    });


    it('should create a name property if not set - single task', function() {

        let config = {
            "freqDist": [
                {
                    "index": "foo",
                    "target": "fb.author.gender",
                    "threshold": 2
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        console.log(JSON.stringify(configTasks, undefined, 4));

        expect(configTasks[0].name).to.equal("fb.author.gender");
    });


    it('should create a name property if not set - custom nested', function() {

        let config = {
            "freqDist": [
                {
                    "index": "foo",
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.type",
                        "threshold": 2
                    }
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        expect(configTasks[0].name).to.equal("fb.author.gender-THEN-fb.type");
    });

    it.only('should create a name property if not set - merged custom nested tasks', function() {

        let config = {
            "merged_custom_nested": [
                {
                    "index": "baseline",
                    "id": "baseline",
                    "filter": "fb.author.country in \"United States\" and fb.type != \"story\"",
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                },
                {
                    "index": "batman",
                    "filter": "fb.author.country in \"United States\" and fb.type != \"story\"",
                    "id": "batmanvsuperman",
                    "target": "fb.author.age",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        //console.log(JSON.stringify(configTasks, undefined, 4));

        //expect(configTasks[0].name).to.equal("fb.author.gender");
    });

});