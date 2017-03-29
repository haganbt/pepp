"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const requestFactory = require("../../lib/requestFactory").requestFactory;
const queue = require("../../lib/queue");

describe("SINGLE TASK", function() {
  it.skip("0 level", async () => {
    const config = {
      freqDist: [
        {
          target: "li.all.articles.author.member.gender",
          threshold: 2
        }
      ]
    };


    const task = taskManager.loadConfigTasks(config);
    const reqObj = requestFactory(task[0]);
    const result = await queue.queueRequest(reqObj, task[0]);

    //console.log(JSON.stringify(result, undefined, 4));

    // {
    //   "male": {
    //     "interactions": 84050200,
    //     "unique_authors": 20751600
    //     },
    //   "female": {
    //       "interactions": 28473100,
    //       "unique_authors": 10194700
    //   }
    // }

    expect(result).to.be.an("object");
    expect(result).to.have.all.keys(["male", "female"]);

  });
});