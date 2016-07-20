"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const queue = require('../../lib/queue');
const taskProcessor = require('../../lib/taskManager');

const config = {
    "timeSeries": [
        {
            "interval": "day",
            "span": 1
        }
    ]
};


describe("Single task tests - timeSeries", function(){

    it('timeSeries', function() {

        let configTasks = taskProcessor.loadConfigTasks(config);

        return queue.queueRequest(configTasks[0]).then(function(result){

            expect(result[0]).to.have.all.keys(["key", "interactions", "unique_authors"]);
            expect(result[0].key).to.be.a('string'); //timestamp correctly converted

        });
    });

});