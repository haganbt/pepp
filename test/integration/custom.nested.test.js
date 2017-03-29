"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const requestFactory = require("../../lib/requestFactory").requestFactory;
const queue = require("../../lib/queue");

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
    const result = await queue.queueRequest(reqObj, task[0]);

    // {
    //   "united states": {
    //     "interactions": 229778200,
    //     "unique_authors": 15044700,
    //     "male": {
    //       "interactions": 27226900,
    //       "unique_authors": 6740200
    //     },
    //     "female": {
    //       "interactions": 9181500,
    //       "unique_authors": 3422700
    //     }
    //   },
    //   "united kingdom": {
    //     "interactions": 94953100,
    //     "unique_authors": 3790000,
    //     "male": {
    //       "interactions": 7755300,
    //       "unique_authors": 1615200
    //     },
    //     "female": {
    //       "interactions": 2803000,
    //       "unique_authors": 909100
    //     }
    //   }
    // }

    console.log("====");
    console.log(JSON.stringify(result, undefined, 4));

    expect(result).to.be.an("object");


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