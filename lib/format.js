"use strict";
const config = require("config");
const moment = require("moment");
const _ = require("underscore");

const log = require("./helpers/logger");

const format = process.env.FORMAT ||
  (config.has("app.format") ? config.get("app.format") : "json");

/**
 * escapeString - escape specific characters for CSV
 *
 * @param "s" - string
 * @returns string
 */
function escapeString(s) {
  if (s.indexOf("\"") != -1) {
    s = s.replace(/"/g, "\"\"");
  }

  if (s.indexOf("\n") != -1) {
    s = s.replace(/\n/g, "");
  }

  if (s.match(/"|,/)) {
    s = "\"" + s + "\"";
  }
  return s;
}

/**
 * jsonToCsv - convert json to csv.
 * See /test/unitformat.test.js for supported formats
 *
 * @param obj
 * @returns {Promise}
 */
function jsonToCsv(obj, task) {
  log.info("Converting to CSV...");

  return new Promise(resolve => {
    if (format !== "csv") {
      resolve(obj);
    }

    const splitKeys = 0;
    let splitCount = 0;
    let k4 = "";
    let k3 = "";
    let k2 = "";
    let k1 = "";
    let stats = {};

    /**
     *
     * @param n
     * @returns {boolean}
     */
    function isInt(n) {
      return n % 1 === 0;
    }

    /**
     *
     * @param i
     * @returns {boolean}
     */
    function isValidKey(i) {
      const fields = [
        "total_unique_authors",
        "interactions_percentage",
        "unique_authors_percentage",
        "target",
        "results",
        "redacted",
        "analysis_type",
        "key",
        "interactions",
        "unique_authors",
        "child",
        "threshold",
        "parameters"
      ];

      if (fields.indexOf(i) > -1) {
        return true;
      }
      return false;
    }

    const traverse = function traverse(o) {
      for (const i in o) {
        stats = stats || {};
        stats.data = stats.data || {};
        stats.keys = stats.keys || [];

        // Merged task?
        if (isValidKey(i) === false && isInt(i) === false) {
          k1 = "";
          if (i.includes("__")) {
            // custom merged will merge result keys with "__"
            const resToSplit = i.split("__");

            // count the number of columns as this can vary
            splitCount = resToSplit.length;

            /*
            resToSplit.forEach(v => {
              k1 += escapeString(v) + ',';
            });
            */
          } else {
            //k1 = escapeString(i) + ',';

            //splitCount = 1;
          }

          k1 = escapeString(i) + ',';

          stats.data[k1] = stats.data[k1] || {};
          stats.data[k1].interactions = stats.data[k1].interactions ||
            o[i].interactions;

        }

        // k2 node
        if (
          o[i].key && o[i].child && o[i].child.results[0] &&
            o[i].child.results[0].child &&
            o[i].child.results[0].child.results[0]
        ) {


          k2 = escapeString(o[i].key) + ',';

          const q = k1 + k2.slice(0, -1);;

          stats.data[q] = stats.data[q] || {};
          stats.data[q].interactions = stats.data[q].interactions ||
            o[i].interactions;
        }

        // k3 node
        if (o[i].key && o[i].child && !o[i].child.results[0].child) {

          k3 = escapeString(o[i].key) + ',';

          const p = k1 + k2 + k3.slice(0, -1);

          stats.data[p] = stats.data[p] || {};
          stats.data[p].interactions = stats.data[p].interactions ||
            o[i].interactions;
        }

        // k4 node
        if (o[i].key && !o[i].child) {
          k4 = escapeString(o[i].key) + ',';

          const y = k1 + k2 + k3 + k4.slice(0, -1);

          stats.data[y] = stats.data[y] || {};
          stats.data[y].interactions = stats.data[y].interactions || o[i].interactions;

          stats.keys.push(y);
        }

        if (o[i] !== null && typeof o[i] == "object") {
          traverse(o[i]);
        }
      }
    };

    traverse(obj);

    console.log(JSON.stringify(stats, undefined, 4));


    // build csv
    let csv = "interactions,unique_authors\n";

    /*
    for (let k = splitKeys; k > 0; k--) {
      csv = "key" + k + "," + csv;
    }
    */
    stats.keys.map(key => {
      const eachKey = key.split(",");
      let last = "";

      eachKey.map(key => {

        key += ",";
        last += key;

        const lastKey = last.slice(0, -1);

        // do we have the interactions stored?
        if(stats.data[lastKey]){
          csv += key + stats.data[lastKey].interactions + ",";
        } else {
          // must be a merged query name as we dont have any
          // interaction or author records. Just output the name.
          csv += key;
        }

      });

      csv = csv.slice(0, -1);
      csv += "\n";
    });
    console.log("==============================");
    console.log(csv);

    resolve(csv);
  }).catch(e => {
    log.error("Error parsing csv: " + e);
  });
}

exports.jsonToCsv = jsonToCsv;
