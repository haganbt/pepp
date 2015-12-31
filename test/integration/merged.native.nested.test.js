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

const config = {
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


describe("Merged Native Nested", function(){

    it.skip('3 level nested', function() {

        let configTasks = taskProcessor.loadConfigTasks(config);




        //return

           // result = taskHelper.compact(result);

            //console.log(JSON.stringify(result, undefined, 4));

            //expect(result[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            //expect(result[0].child).to.have.all.keys(["analysis_type", "parameters", "results", "redacted"]);
            //expect(result[0].child.results[0]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);
            //expect(result[0].child.results[1]).to.have.all.keys(["key", "interactions", "unique_authors", "child"]);

       // });
    });

});