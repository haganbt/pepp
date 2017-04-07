"use strict";
const _ = require("underscore");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const cacheHelper = require("../../lib/helpers/cache");

// Helpers
/**
 * Creates a first level object
 * @returns {*}
 */
function addRoot() {
  const id = cacheHelper.create();
  const k1 = "yogi";
  const d1 = { interactions: 1, unique_authors: 2 };

  const k2 = "booboo";
  const d2 = { interactions: 3, unique_authors: 4 };

  cacheHelper.addKey(id, k1);
  cacheHelper.addKey(id, k2);

  cacheHelper.addData(id, k1, d1);
  cacheHelper.addData(id, k2, d2);

  return id;
}

/**
 * Creates a child object on a parent
 * @returns {*}
 */
function addChild() {
  const id = addRoot();
  const data = [
    { key: "mutley", interactions: 5, unique_authors: 6 },
    { key: "smith", interactions: 7, unique_authors: 8 }
  ];

  cacheHelper.addData(id, "yogi", data);

  return id;
}

describe("CACHE HELPER", () => {

  it("Should add single key and results object", () => {
    const id = addRoot();
    const results = cacheHelper.get(id);

    expect(
      results
    ).to.deep.equal(
      {
        "remainingTasks": 0,
        "yogi": {
          "interactions": 1,
          "unique_authors": 2
        },
        "booboo": {
          "interactions": 3,
          "unique_authors": 4
        }
      });
  });


  it("Should add an array of objects to a parent", () => {
    const id = addChild();
    const results = cacheHelper.get(id);

    expect(
      results
    ).to.deep.equal(
      {
        "remainingTasks": 0,
        "yogi": {
          "interactions": 1,
          "unique_authors": 2,
          "mutley": {
            "interactions": 5,
            "unique_authors": 6
          },
          "smith": {
            "interactions": 7,
            "unique_authors": 8
          }
        },
        "booboo": {
          "interactions": 3,
          "unique_authors": 4
        }
      }
    );
  });


  it("Should add an array of objects to a parent with a nested merge key", () =>
    {
      const id = addChild();

      const data = [
        { key: "wilee", interactions: 9, unique_authors: 10 },
        { key: "roadrunner", interactions: 11, unique_authors: 12 }
      ];

      cacheHelper.addData(id, "yogi__mutley", data);

      const results = cacheHelper.get(id);

      expect(results).to.deep.equal(
        {
          "remainingTasks": 0,
          "yogi": {
            "interactions": 1,
            "unique_authors": 2,
            "mutley": {
              "interactions": 5,
              "unique_authors": 6,
              "wilee": {
                "interactions": 9,
                "unique_authors": 10
              },
              "roadrunner": {
                "interactions": 11,
                "unique_authors": 12
              }
            },
            "smith": {
              "interactions": 7,
              "unique_authors": 8
            }
          },
          "booboo": {
            "interactions": 3,
            "unique_authors": 4
          }
        }
      );
    });
});
