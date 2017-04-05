"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const request = require("../../lib/request");
const requestFactory = require("../../lib/requestFactory").requestFactory;


describe("CUSTOM NESTED", function() {
  it("1 level", async () => {
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
    const result = await request.make(reqObj, task[0]);

    console.log("====");
    console.log(result);

    expect(result).to.be.an("object");

/*
    for (let [key, value] of Object.entries(result)) {

      expect(result[key]).to.have.all.keys([
        "interactions",
        "unique_authors",
        "male",
        "female"
      ]);
      expect(result[key]["male"]).to.have.all.keys([
        "interactions",
        "unique_authors"
      ]);
      expect(result[key]["female"]).to.have.all.keys([
        "interactions",
        "unique_authors"
      ]);
    }
*/

  });

  it.skip("2 level", async () => {
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