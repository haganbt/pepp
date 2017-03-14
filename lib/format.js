"use strict";

const config = require("config");
const moment = require("moment");
const _ = require("underscore");

const log = require("./helpers/logger");

const format = process.env.FORMAT ||
  (config.has("app.format") ? config.get("app.format") : "json");

let logKey;

/**
 * escapeString - escape specific characters for CSV
 *
 * @param "s" - string
 * @returns string
 */
function escapeString(s) {
  if (s.indexOf('"') != -1) {
    s = s.replace(/"/g, '""');
  }

  if (s.indexOf("\n") != -1) {
    s = s.replace(/\n/g, "");
  }

  if (s.match(/"|,/)) {
    s = '"' + s + '"';
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

    let csv = "interactions,unique_authors\n";
    let splitKeys = 0;
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
      for (let i in o) {

        stats = stats || {};
        stats.data = stats.data || {};
        stats.allKeys = stats.allKeys || {};

        // Merged task?
        if (isValidKey(i) === false && isInt(i) === false) {

          k1 = "";
          if (i.includes("__")) { // custom merged will merge result keys with "__"
            const resToSplit = i.split("__");

            // count the number of columns as this can vary
            splitCount = resToSplit.length;

            resToSplit.forEach(v => {
              k1 += escapeString(v) + ",";
            });
          } else {
            k1 = escapeString(i) + ",";

            splitCount = 1;
          }
        }

        // k2 node
        if (
          o[i].key
          && o[i].child
          && o[i].child.results[0]
          && o[i].child.results[0].child
          && o[i].child.results[0].child.results[0]) {

          k2 = escapeString(o[i].key) + ",";

          let q = k1 + k2;

          stats.data[q] = stats.data[q] || {};
          stats.data[q].interactions = stats.data[q].interactions || o[i].interactions;

        }

        // k3 node
        if (o[i].key && o[i].child && !o[i].child.results[0].child) {
          k3 = escapeString(o[i].key) + ",";

          let p = k1 + k2 + k3;

          stats.data[p] = stats.data[p] || {};
          stats.data[p].interactions = stats.data[p].interactions || o[i].interactions;

        }

        // k4 node
        if (o[i].key && !o[i].child) {

          k4 = escapeString(o[i].key) + ",";

          let y = k1 + k2 +  k3 + k4;


          stats.data[y] = stats.data[y] || {};
          stats.data[y].interactions = stats.data[y].interactions || o[i].interactions;



          stats.allKeys[y] = stats.allKeys[y] || {};
          stats.allKeys[y].unique_authors = o[i].unique_authors;
          stats.allKeys[y].interactions = o[i].interactions;


        }

        if (o[i] !== null && typeof(o[i])=="object") {

          traverse(o[i]);
        }
      }
    };

    traverse(obj);

    console.log(JSON.stringify(stats, undefined, 4));
    console.log("==============================");

    // build csv
    /*
    for (let k = splitKeys; k > 0; k--) {
      csv = "key" + k + "," + csv;
    }
    */


    /*
    function foo(d) {
      for (let idx in d) {

        if (d[idx] !== null && typeof d[idx] == "object") {
          foo(d[idx]);
        }

      }
    }

    foo(stats);
*/

    for (let idx in stats.allKeys) {

      let parts = idx.split(',');

      let last = '';
      parts.map(i => {

        i += ',';
        last += i;

        if(i === ','){
          return;
        }

        csv += i + stats.data[last].interactions + ",";

      });

      csv += "\n";

    }


    console.log('================');

    console.log(csv);

    resolve(csv);

  }).catch(e => {
    log.error("Error parsing csv: " + e);
  });
}

exports.jsonToCsv = jsonToCsv;
