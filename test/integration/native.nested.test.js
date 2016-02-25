"use strict";
process.env.NODE_ENV = 'test';

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const queue = require('../../lib/queue');
const taskProcessor = require('../../lib/taskProcessor');

const config = {
    "freqDist": [
        {
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
};


describe("Native Nested", function(){

    it('3 level nested', function() {

        let configTasks = taskProcessor.loadConfigTasks(config);

        return queue.queueTask(configTasks[0]).then(function(result){

            expect(result[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].child).to.have.all.keys(["analysis_type", "parameters", "results", "redacted"]);
            expect(result[0].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            expect(result[0].child.results[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

        });
    });

});