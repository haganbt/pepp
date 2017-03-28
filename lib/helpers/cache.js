"use strict";
const shortid = require("shortid");
const _ = require("underscore");

const log = require("./logger");

const data = {};

module.exports = {

  create: function create() {
    const id = shortid.generate();

    data[id] = {
      remainingTasks: 0
    };

    log.trace(`CACHE: New id created [${id}]`);
    return id;
  },

  debugAll() {
    log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));
  },

  increment(id) {
    data[id].remainingTasks++;
  },

  decrement(id) {
    data[id].remainingTasks--;
  },

  get: function get(id) {
    return data[id];
  },

  addKey: function addKey(id, key) {

    // create the key unless already created
    /*
    if (_.has(data[id], key)) {
      log.trace("CACHE: returning false when adding new key \"" + key + "\" with id:", id);
      log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));
      return false;
    }
    */
    data[id].remainingTasks++;

    data[id][key] = {};
    log.trace(`CACHE: Added new key [${key}] to [${id}]`);

    return true;
  },

  addData: function addData(id, key, cacheData) {
    log.trace(`CACHE: data added:`);
    log.trace(`    - ID: ${id}, KEY: ${JSON.stringify(key, undefined, 2)}, DATA: ${JSON.stringify(cacheData, undefined, 2)}`);


    /**
     * If we dont have a mergeKey, use the response result
     * key as the mergeKey.
     *
     */
    if(key === undefined){
      cacheData.map(item => {

        const k = item.key;

        data[id][k] = {
          interactions: item.interactions,
          unique_authors: item.unique_authors
        };

      });

      return data[id];
    }



    console.log(key);
    console.log(id);
    console.log(data[id][key]);
    console.log(cacheData);
    console.log(typeof(cacheData));

    log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));

    /**
     * data will be sent to the cache as either an object:
     *
     *    { interactions: 95690700, unique_authors: 3794800 }
     *
     *  or an array of objects:
     *
     *    [
     *      { key: 'male', interactions: 28381000, unique_authors: 6778300 },
     *      { key: 'female', interactions: 9982500, unique_authors: 3671300 }
     *    ]
     *
     * If it is an array of objects, iterate the keys and save
     * them under the parent key.
     *
     */


    data[id].remainingTasks--;

    if (Array.isArray(cacheData) === true) {

      console.log("==================================");

      cacheData.map(item => {

        const k = item.key;

        data[id][key][k] = {
          interactions: item.interactions,
          unique_authors: item.unique_authors
        };
      });

    } else {
      Object.assign(data[id][key] || {}, cacheData);
    }

    return data[id];
  },

  /**
     * If a task has failed, set the cache data accordingly
     * so that the rest of the data returns.
     *
     * @param cacheObj
     * @returns {*}
     */
  setFailed: function setFailed(cacheObj) {
    log.trace(
      "CACHE: Dropping key from cache due to failed task",
      cacheObj.mergeKey
    );
    data[cacheObj.cacheId][cacheObj.mergeKey] = [ "failed task" ];
    data[cacheObj.cacheId].remainingTasks--;
    return data[cacheObj.cacheId];
  }
};
