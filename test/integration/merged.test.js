"use strict";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const taskManager = require("../../lib/taskManager");
const request = require("../../lib/request");
const requestFactory = require("../../lib/requestFactory").requestFactory;

describe("MERGED ", function() {

  it.only("single tasks", async () => {
    const config = {
      freqDist: [
        {
          "foo": [
            {
              filter: "li.all.articles.title ANY \"the,and,it,a\"",
              target: "li.all.articles.author.member.gender",
              threshold: 2
            },
            {
              target: "li.all.articles.author.member.gender",
              threshold: 2
            }
          ]
        }
      ]
    };

    const task = taskManager.loadConfigTasks(config)[0];
    const reqObj = requestFactory(task);
    const result = await request.make(reqObj, task);


    /*
    const keys = Object.keys(result);
    expect(keys).to.have.length(2);

    expect(result).to.have.all.keys(["male", "female"]);
    expect(result.male).to.have.all.keys(["interactions", "unique_authors"]);
*/

    console.log(JSON.stringify(result, undefined, 4));


  });

});