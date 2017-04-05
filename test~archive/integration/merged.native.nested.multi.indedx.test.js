"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const queue = require('../../lib/response');
const taskProcessor = require('../../lib/taskManager');
const taskHelper = require('../../lib/helpers/task');


describe.skip("Merged Native Nested Multi-Index", function(){

    it ('2 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "index": "foo", // will use ENV settings
                            "id":"booboo",
                            "target": "fb.parent.author.gender",
                            "threshold": 2,
                            "child": {
                                "target": "fb.author.age",
                                "threshold": 2
                            }
                        },
                        {
                            "id": "yogi",
                            "target": "fb.parent.author.gender",
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
            return queue.queueRequest(each);
        })).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0].booboo).to.not.equal(result[0].yogi);

        });
    });


    it('3 level nested', function() {

        let config = {
            "freqDist": [
                {
                    "merged_native_nested": [
                        {
                            "index": "foo", // will use ENV settings
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
            return queue.queueRequest(each);
        })).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0].booboo).to.not.equal(result[0].yogi);

        });

    });

});