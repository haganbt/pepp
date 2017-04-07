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

    const task = taskManager.loadConfigTasks(config)[0];
    const reqObj = requestFactory(task);
    const result = await request.make(reqObj, task);

    // {
    //   "united states": {
    //   "interactions": 227869400,
    //     "unique_authors": 14968500,
    //     "male": {
    //     "interactions": 24638300,
    //       "unique_authors": 6346000
    //   },
    //   "female": {
    //     "interactions": 7906200,
    //       "unique_authors": 2881200
    //   }
    // },
    //   "united kingdom": {
    //   "interactions": 94971600,
    //     "unique_authors": 3772100,
    //     "male": {
    //     "interactions": 7192300,
    //       "unique_authors": 1555700
    //   },
    //   "female": {
    //     "interactions": 2482100,
    //       "unique_authors": 837300
    //   }
    // }
    // }
    expect(result).to.be.an("object");

    for (let [ key, value ] of Object.entries(result)) {
      expect(
        result[key]
      ).to.have.all.keys([ "interactions", "unique_authors", "male", "female" ]);

      expect(
        result[key]["male"]
      ).to.have.all.keys([ "interactions", "unique_authors" ]);
      expect(
        result[key]["female"]
      ).to.have.all.keys([ "interactions", "unique_authors" ]);
    }
  });

  it("2 level", async () => {
    const config = {
      freqDist: [
        {
          target: "li.all.articles.author.member.gender",
          threshold: 2,
          then: {
            target: "li.user.member.country",
            threshold: 2,
            then: {
              target: "li.all.articles.author.member.age",
              threshold: 10
            }
          }
        }
      ]
    };

    const task = taskManager.loadConfigTasks(config)[0];
    const reqObj = requestFactory(task);
    const result = await request.make(reqObj, task);

    // {
    //   "male": {
    //      "interactions": 76676300,
    //      "unique_authors": 18876400,
    //        "united states": {
    //            "35-54": {
    //       "interactions": 9497400,
    //         "unique_authors": 3290000
    //     },
    //     "unknown": {
    //       "interactions": 5721000,
    //         "unique_authors": 2204900
    //     },
    //     "55+": {
    //       "interactions": 4549700,
    //         "unique_authors": 1893700
    //     },
    //     "25-34": {
    //       "interactions": 3798700,
    //         "unique_authors": 1743400
    //     },
    //     "18-24": {
    //       "interactions": 985900,
    //         "unique_authors": 587800
    //     }
    //   },
    //   "united kingdom": {
    //     "35-54": {
    //       "interactions": 3022500,
    //         "unique_authors": 943400
    //     },
    //     "unknown": {
    //       "interactions": 1524100,
    //         "unique_authors": 531900
    //     },
    //     "55+": {
    //       "interactions": 1368800,
    //         "unique_authors": 527100
    //     },
    //     "25-34": {
    //       "interactions": 1085200,
    //         "unique_authors": 446000
    //     },
    //     "18-24": {
    //       "interactions": 184500,
    //         "unique_authors": 102800
    //     }
    //   }
    // },
    //   "female": {
    //   "interactions": 25224100,
    //     "unique_authors": 9173800,
    //     "united kingdom": {
    //     "35-54": {
    //       "interactions": 971700,
    //         "unique_authors": 407300
    //     },
    //     "25-34": {
    //       "interactions": 637200,
    //         "unique_authors": 273500
    //     },
    //     "unknown": {
    //       "interactions": 514200,
    //         "unique_authors": 260500
    //     },
    //     "55+": {
    //       "interactions": 254000,
    //         "unique_authors": 131700
    //     },
    //     "18-24": {
    //       "interactions": 92700,
    //         "unique_authors": 56600
    //     }
    //   },
    //   "united states": {
    //     "35-54": {
    //       "interactions": 2765600,
    //         "unique_authors": 1336200
    //     },
    //     "unknown": {
    //       "interactions": 2010500,
    //         "unique_authors": 993300
    //     },
    //     "25-34": {
    //       "interactions": 1721900,
    //         "unique_authors": 782700
    //     },
    //     "55+": {
    //       "interactions": 1006100,
    //         "unique_authors": 539200
    //     },
    //     "18-24": {
    //       "interactions": 334400,
    //         "unique_authors": 196300
    //     }
    //   }
    // }
    // }

    expect(result.male.interactions).to.exist;
    expect(result.male.unique_authors).to.exist;
    expect(result.female.interactions).to.exist;
    expect(result.female.unique_authors).to.exist;

    const l1keys = Object.keys(result);
    expect(l1keys).to.have.length(2);

    const l2keys = Object.keys(result["male"]);
    expect(l2keys).to.have.length(4);

    const l3keys = Object.keys(result["male"]["united states"]);
    expect(l3keys).to.have.length(5);

    expect(result["male"]["united states"]).to.have.keys(["35-54","unknown","55+","25-34","18-24"]);
    expect(result["male"]["united kingdom"]).to.have.keys(["35-54","unknown","55+","25-34","18-24"]);

    expect(result["female"]["united states"]).to.have.keys(["35-54","unknown","55+","25-34","18-24"]);
    expect(result["female"]["united kingdom"]).to.have.keys(["35-54","unknown","55+","25-34","18-24"]);

    expect(result["female"]["united kingdom"]["35-54"]["interactions"]).to.exist;
    expect(result["female"]["united kingdom"]["35-54"]["unique_authors"]).to.exist;
    expect(result["male"]["united kingdom"]["35-54"]["interactions"]).to.exist;
    expect(result["male"]["united kingdom"]["35-54"]["unique_authors"]).to.exist;

    expect(result["female"]["united states"]["35-54"]["interactions"]).to.exist;
    expect(result["female"]["united states"]["35-54"]["unique_authors"]).to.exist;
    expect(result["male"]["united states"]["35-54"]["interactions"]).to.exist;
    expect(result["male"]["united states"]["35-54"]["unique_authors"]).to.exist;

  });
});
