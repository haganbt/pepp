"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const requestFactory = require("../../lib/requestFactory").requestFactory;
const queue = require("../../lib/queue");

describe("CUSTOM NESTED", function() {
  it.skip("1 level", async () => {
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

    const task = taskManager.loadConfigTasks(config);
    const reqObj = requestFactory(task[0]);
    const result = await queue.queueRequest(reqObj, task[0]);

    expect(result).to.be.an("array");
    expect(result[0]).to.be.an("object");

    console.log(JSON.stringify(result, undefined, 4));

    for (let [key, value] of Object.entries(result[0])) {

      expect(result[0][key]).to.have.all.keys([
        "interactions",
        "unique_authors",
        "male",
        "female"
      ]);
      expect(result[0][key]["male"]).to.have.all.keys([
        "interactions",
        "unique_authors"
      ]);
      expect(result[0][key]["female"]).to.have.all.keys([
        "interactions",
        "unique_authors"
      ]);
    }

  });

  it("2 level", async () => {
    const config = {
      freqDist: [
        {
          target: "li.user.member.country",
          threshold: 2,
          then: {
            target: "li.all.articles.author.member.gender",
            threshold: 2,
            then: {
              target: "li.user.member.employer_industry_sectors",
              threshold: 2
            }
          }
        }
      ]
    };

    const task = taskManager.loadConfigTasks(config);
    const reqObj = requestFactory(task[0]);
    const result = await queue.queueRequest(reqObj, task[0]);

    console.log(JSON.stringify(result, undefined, 4));

    expect(result).to.be.an("array");
    expect(result[0]).to.be.an("object");




  });
});