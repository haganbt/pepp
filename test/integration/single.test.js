"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const request = require("../../lib/request");
const requestFactory = require("../../lib/requestFactory").requestFactory;

describe("SINGLE TASK", function() {
  it("0 level", async () => {
    const config = {
      freqDist: [
        {
          target: "li.all.articles.author.member.gender",
          threshold: 2
        }
      ]
    };

    const task = taskManager.loadConfigTasks(config)[0];
    const reqObj = requestFactory(task);
    const result = await request.make(reqObj, task);

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
    expect(result["male"]).to.have.all.keys(["interactions", "unique_authors"]);
    expect(result["female"]).to.have.all.keys(["interactions", "unique_authors"]);

  });
});