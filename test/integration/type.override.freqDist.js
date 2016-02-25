"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const queue = require('../../lib/queue');
const taskProcessor = require('../../lib/taskProcessor');

describe("Type Override - freqDist to timeSeries", function(){

    it('2 level depth', function() {

        let config = {
            "freqDist": [
                {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "then": {
                        "type": "timeSeries",
                        "interval": "day"
                    }
                }
            ]
        };

        let configTasks = taskProcessor.loadConfigTasks(config);

        return queue.queueTask(configTasks[0]).then(function(result){

            expect(result[0].male[0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0].female[0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0].male[0].key).to.be.a('string');
            expect(result[0].female[0].key).to.be.a('string');

        });
    });


});