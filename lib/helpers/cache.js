"use strict";
const shortid = require("shortid");
const _ = require("underscore");

const log = require("./logger");

const data = {};

/**
 * createNestedObject - traverses and object creating keys based on a
 * passed array. Optionally pass in values for the last key.
 *
 * @param base - the base object
 * @param names - an array of strings containing the names of the objects
 * @param value - (optional): if given, will be the last object in the hierarchy
 * @returns {*} - the last object in the hierarchy ie. parent
 */
const createNestedObject = function(base, names, value) {
  // If a value is given, remove the last name and keep it for later:
  const lastName = arguments.length === 3 ? names.pop() : false;

  // Walk the hierarchy, creating new objects where needed.
  // If the lastName was removed, then the last object is not set yet:
  for (let i = 0; i < names.length; i++) {
    base = base[names[i]] = base[names[i]] || {};
  }

  // If a value was given, set it to the last name:
  if (lastName)
    base = base[lastName] = value;

  return base;
};




module.exports = {
  create: function create() {
    const id = shortid.generate();

    data[id] = { remainingTasks: 0 };

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

    // Only create the key
    if (key.includes("__") === false) {
      data[id][key] = {};
      log.trace(`CACHE: Added new key [${key}] to [${id}]`);

      return true;
    }
  },
  addData: function addData(id, key, cacheData) {

    /*
      todo - remove me
     console.log(key);
     console.log(id);
     console.log(data[id][key]);
     console.log(cacheData);
     console.log(typeof(cacheData));
     */

    log.trace(`CACHE: data added:`);
    log.trace(
      ` ID: ${id}, 
        KEY: ${JSON.stringify(key, undefined,2)}, 
        DATA: ${JSON.stringify(cacheData, undefined, 2)}`
    );

    // No mergeKey? (single task or parent task), use
    // response result key as the mergeKey.
    if (key === undefined) {

      cacheData.map(item => {
        const k = item.key;

        data[id][k] = {
          interactions: item.interactions,
          unique_authors: item.unique_authors
        };
      });

      return data[id];
    }


    // Data will be sent to the cache as either an object:
    //
    //    { interactions: 95690700, unique_authors: 3794800 }
    //
    // or an array of objects:
    //
    //    [
    //        { key: 'male', interactions: 28381000, unique_authors: 6778300 },
    //        { key: 'female', interactions: 9982500, unique_authors: 3671300 }
    //    ]
    //
    // If it is an array of objects, iterate the keys and save them
    // under the parent key.
    //
    if (Array.isArray(cacheData) === true) {

      cacheData.map(item => {

        // Merged reult keys?
        if (key.includes("__") === true) {
          // Build a string of the current key path
          const k = key + "__" + item.key;

          // Build the path in the object and save the results
          createNestedObject(data[id], k.split("__"), {
            interactions: item.interactions,
            unique_authors: item.unique_authors
          });
        } else {

          const k = item.key;

          data[id][key][k] = {
            interactions: item.interactions,
            unique_authors: item.unique_authors
          };
        }

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
