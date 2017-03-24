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
      log.trace(`CACHE: New id created [${id}]`);
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
        'CACHE: returning false when adding new key "' + key + '" with id:',
        id
      );
      log.trace("CACHE DEBUG:", JSON.stringify(data, undefined, 4));
      return false;
    }

    data[id][key] = {};
    log.trace(`CACHE: Added new key [${key}] to [${id}]`);

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
    log.trace(`CACHE: data added:`);
    log.trace(`    - ID:    ${id}`);
    log.trace(`    - KEY:   ${key}`);
    log.trace('    - DATA: ', cacheData);

    // todo - will occur if the same cache id is being used
    // and remainingTasks have been deleted from the previous response.
    if(!data[id].remainingTasks){
      data[id].remainingTasks = 0;
    }

    /*
    console.log(key);
    console.log(id);
    console.log(data[id][key]);
    console.log(cacheData);
    console.log(typeof(cacheData));
*/


    data[id].remainingTasks++;

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
    if(Array.isArray(cacheData) === true){

      cacheData.map(item => {

        const k = item.key;

        data[id][key][k] = {
          interactions: item.interactions,
          unique_authors: item.unique_authors
        } ;

      })

    } else {
      Object.assign(data[id][key] || {},cacheData);
    }


    console.log(cacheData);




    /*

  if(Array.isArray(cacheData) === true){

    Object.assign(data[id][key] || [],cacheData);

  } else {

  }
*/



    /*
    if(data[id][key]){
      Object.assign(data[id][key] , cacheData);
    } else {
      data[id][key] = cacheData || [];
    }
*/

    //Object.assign(data[id][key] || [], cacheData);

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
    log.trace("CACHE: Dropping key from cache due to failed task", cacheObj.mergeKey);
    data[cacheObj.cacheId][cacheObj.mergeKey] = ["failed task"];
    data[cacheObj.cacheId].remainingTasks--;
    return data[cacheObj.cacheId];
  }
};
