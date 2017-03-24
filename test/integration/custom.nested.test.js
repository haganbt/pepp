"use strict";

const _ = require("underscore");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const requestFactory = require("../../lib/requestFactory").requestFactory;
const queue = require("../../lib/queue");

//const taskHelper = require('../../lib/helpers/task');

describe("Custom Nested", function() {
  it("2 level depth", function() {
    const config = {
      freqDist: [
        {
          target: "li.user.member.country",
          threshold: 2,
          then: {
            target: "li.all.articles.author.member.gender",
            threshold: 2
          }
        }
      ]
    };

    const normalizedTasks = taskManager.loadConfigTasks(config);
    normalizedTasks.forEach(task => {

      const reqObj = requestFactory(task);

      queue
        .queueRequest(reqObj, task)
        .then(response => {
          if (response === undefined || _.isEmpty(response)) {
            return;
          }
          return response;
        })
        .then(response => {
          console.log(JSON.stringify(response, undefined, 4));
        });
    });
  });
});

/*

        let configTasks = taskProcessor.loadConfigTasks(config);

        return queue.queueRequest(configTasks[0]).then(function(result){

            expect(result[0]).to.have.all.keys(["male", "female", "unknown"]);

            expect(result[0]["male"]).to.be.an('array');
            expect(result[0]["male"]).to.have.length(2);

            expect(result[0]["female"]).to.be.an('array');
            expect(result[0]["female"]).to.have.length(2);

        });


*/
