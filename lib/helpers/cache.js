'use strict';

const uuid = require('node-uuid');

var data = {};

module.exports = {

    /**
     * create - new cache object
     * @returns {*}
     */
    create: function set() {
        let id = uuid.v1();
        data[id] = { "remainingTasks": 0 };
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
        //increment count of expected responses
        data[id].remainingTasks ++;

        //create the key unless already created
        if(data[id].hasOwnProperty(key)){
            return false;
        } else {
            data[id][key] = {};
        }
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
        data[id][key] = cacheData || [];
        data[id].remainingTasks --;
        return data[id];
    }
};
