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
    "freqDist": [
        {
            "target": "fb.author.region",
            "threshold": 2
        }
    ]
};


describe("Single task tests - freqDist", function(){

    it('freqDist', function() {

        let configTasks = taskProcessor.loadConfigTasks(config);

        var value = queue.queueRequest(configTasks[0]).then(function(obj) {
            return obj[1]; // check 2 values are returned
        });

        return expect(value).to.eventually.to.have.all.keys(["key", "interactions", "unique_authors"]);

    });

});