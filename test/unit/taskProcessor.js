"use strict";
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const taskProcessor = require('../../lib/taskProcessor');

describe("Task Processor", function(){


    describe("Index Parameter", function(){
    
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

    });



    describe("Name Parameter - freqDist", function(){

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


        it('should create a name property if not set - native nested', function() {

            let config = {
                "freqDist": [
                    {
                        "index": "foo",
                        "target": "fb.author.gender",
                        "threshold": 2,
                        "child": {
                            "target": "fb.type",
                            "threshold": 2
                        }
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].name).to.equal("fb.author.gender");
        });



        it('should have a name property if set - single task', function() {

            let config = {
                "freqDist": [
                    {
                        "name": "yogi",
                        "index": "foo",
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].name).to.equal("yogi");
        });


        it('should have a name property if set - custom nested', function() {

            let config = {
                "freqDist": [
                    {
                        "name": "yogi",
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

            expect(configTasks[0].name).to.equal("yogi");
        });


        it('should have a name property if set - native nested', function() {

            let config = {
                "freqDist": [
                    {
                        "name": "yogi",
                        "index": "foo",
                        "target": "fb.author.gender",
                        "threshold": 2,
                        "child": {
                            "target": "fb.type",
                            "threshold": 2
                        }
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].name).to.equal("yogi");
        });


        it('should use array key as name property', function() {

            let config = {
                "freqDist": [
                    {
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
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].name).to.equal("merged_custom_nested");
            expect(configTasks[1].name).to.equal("merged_custom_nested");
        });
    });



    describe("Type Parameter", function(){

        it('freqDist - should create a type property for the task', function() {

            let config = {
                "freqDist": [
                    {
                        "target": "fb.author.gender",
                        "threshold": 2
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].json.parameters.analysis_type).to.equal("freqDist");
        });

        it('timeSeries - should create a type property for the task', function() {

            let config = {
                "timeSeries": [
                    {
                        "interval": "day",
                        "span": 1
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].json.parameters.analysis_type).to.equal("timeSeries");
        });

    });



    describe("Threshold Parameter", function(){

        it('freqDist - should set a default threshold if not specified', function() {

            let config = {
                "freqDist": [
                    {
                        "target": "fb.author.gender",
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);
            
            expect(configTasks[0].json.parameters.parameters.threshold).to.equal(200);
        });

        it('freqDist - should set a threshold if set in config', function() {

            let config = {
                "freqDist": [
                    {
                        "target": "fb.author.gender",
                        "threshold": 27
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].json.parameters.parameters.threshold).to.equal(27);
        });

    });



    describe("Filter Parameter", function(){

        it('freqDist - should be set for a single task', function() {

            let config = {
                "freqDist": [
                    {
                        "filter": "yogi"
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].json.filter).to.equal("yogi");
        });



        it('freqDist - should be inherited for a custom nested task', function() {

            let config = {

                "freqDist": [
                    {
                        "filter": "yogi",
                        "target": "fb.author.gender",
                        "then": {
                            "target": "fb.author.age"
                        }
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            //console.log(JSON.stringify(configTasks, undefined, 2));

            expect(configTasks[0].json.filter).to.equal("yogi");
            expect(configTasks[0].then.filter).to.equal("yogi");
        });



        it('timeSeries - should be set for a single task', function() {

            let config = {
                "timeSeries": [
                    {
                        "filter": "yogi"
                    }
                ]
            };

            let configTasks = taskProcessor.loadConfigTasks(config);

            expect(configTasks[0].json.filter).to.equal("yogi");
        });



    });



});