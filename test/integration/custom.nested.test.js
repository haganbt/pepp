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

describe("Custom Nested", function(){

    it('2 level depth', function() {

        let config = {
            "freqDist": [
                {
                    "target": "fb.author.gender",
                    "threshold": 3,
                    "then": {
                        "target": "fb.type",
                        "threshold": 2
                    }
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        return queue.queueTask(configTasks[0]).then(function(result){

            result = taskHelper.compact(result);

            expect(result[0]).to.have.all.keys(["male", "female", "unknown"]);

            expect(result[0]["male"]).to.be.an('array');
            expect(result[0]["male"]).to.have.length(2);

            expect(result[0]["female"]).to.be.an('array');
            expect(result[0]["female"]).to.have.length(2);

        });
    });

});