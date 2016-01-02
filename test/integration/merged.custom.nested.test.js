"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const queue = require('../../lib/queue');
const taskProcessor = require('../../lib/taskProcessor');
const taskHelper = require('../../lib/helpers/task');


describe("Merged Custom Nested", function(){

    it('2 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "id":"booboo",
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.parent.topics.name",
                                "threshold": 2
                            }
                        },
                        {
                            "id": "yogi",
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.type",
                                "threshold": 2
                            }
                        }
                    ]
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        return Promise.all(configTasks.map(function(each) {
            return queue.queueTask(each);
        })).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0]["yogi-male"][0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["yogi-male"][1]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["yogi-female"][0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["yogi-female"][1]).to.have.all.keys(["key", "interactions", "unique_authors"]);

            expect(result[0]["booboo-male"][0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["booboo-male"][1]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["booboo-female"][0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0]["booboo-female"][1]).to.have.all.keys(["key", "interactions", "unique_authors"]);

        });

    });


    it('3 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "id":"booboo",
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.parent.author.age",
                                "threshold": 2,
                                "then": {
                                    "target": "fb.parent.topics.name",
                                    "threshold": 2
                                }
                            }
                        },
                        {
                            "id": "yogi",
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "then": {
                                "target": "fb.type",
                                "threshold": 2,
                                "then": {
                                    "target": "fb.parent.topics.name",
                                    "threshold": 2
                                }
                            }
                        }
                    ]
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        return Promise.all(configTasks.map(function(each) {
            return queue.queueTask(each);
        })).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0]).to.have.any.keys("yogi-male-like", "yogi-male-comment", "booboo-male-25-34",
                "booboo-male-35-44", "booboo-female-25-34", "booboo-female-35-44", "yogi-female-like",
                "yogi-female-comment");
        });

    });

});