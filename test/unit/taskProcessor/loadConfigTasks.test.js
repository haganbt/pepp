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

});