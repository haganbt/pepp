"use strict";

const shortid = require('shortid');
const _ = require("underscore");

const log = require("./logger");

const data = {};

module.exports = {
  /**
     * Prettry print all cache objects
     */
  debugAll() {
    log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));
  },

  /**
     * create - new cache object
     * @returns {*}
     */
  create: function create(id) {
    id = id || shortid.generate();

    if (_.has(data, id) === false) {
      data[id] = { remainingTasks: 0 };
      log.trace("Created new cacheId:", id);
    }

    return id;
  },

  /**
     * get - by cache id
     * @param id
     * @returns {*}
     */
  get: function get(id) {
    return data[id];
  },

  /**
     * addKey - to cache
     * @param id
     * @param key
     * @returns boolean
     */
  addKey: function addKey(id, key) {



    // create the key unless already created
    if (_.has(data[id], key)) {
      log.trace(
        'Cache returning false when adding new key "' + key + '" with id:',
        id
      );
      log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));
      return false;
    }

    data[id][key] = {};
    log.trace('Added new key "' + key + '" to cache:', id);

    return true;
  },

  /**
     * add - add a key or the data for a key to the cache
     *
     * @param id  - string - cache id
     * @param key - string - the key to be used to store the
     *              data for each response payload.
     * @param cacheData - obj - the data to be cached
     * @returns {*} - obj - cache object
     */
  addData: function addData(id, key, cacheData) {
    log.trace(
      "Adding data to cache. id, key:",
      id,
      key,
      JSON.stringify(cacheData, undefined, 4)
    );

    data[id].remainingTasks++;

    //data[id][key] = cacheData || [];

    console.log(data);
    console.log(id);
    console.log(key);

    Object.assign(data[id][key], cacheData);

    data[id].remainingTasks--;

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
    log.trace("Dropping key from cache due to failed task", cacheObj.mergeKey);
    data[cacheObj.cacheId][cacheObj.mergeKey] = ["failed task"];
    data[cacheObj.cacheId].remainingTasks--;
    return data[cacheObj.cacheId];
  }
};
