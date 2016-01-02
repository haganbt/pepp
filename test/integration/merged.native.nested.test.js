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


describe.only("Merged Native Nested", function(){

    it('2 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "id":"booboo",
                            "target": "fb.author.region",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        },
                        {
                            "id": "yogi",
                            "target": "fb.author.region",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.age",
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

            expect(result[0].booboo[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].booboo[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

            expect(result[0].yogi[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].yogi[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
        });
    });


    it('3 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "id":"booboo",
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
                        },
                        {
                            "id": "yogi",
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
                    ]
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        return Promise.all(configTasks.map(function(each) {
            return queue.queueTask(each);
        })).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0].booboo[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].booboo[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

            expect(result[0].yogi[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].yogi[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

            expect(result[0].booboo[0].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].booboo[1].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

            expect(result[0].yogi[0].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].yogi[1].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

        });

    });

});