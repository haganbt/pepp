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


  console.log("---------------------------------- raw in to csv");
  console.log(JSON.stringify(obj, undefined, 4));
  console.log("----------------------------------");

  return new Promise(resolve => {
    if (format !== "csv") {
      resolve(obj);
    }

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
        "analysis",
        "analysis_type",
        "child",
        "interactions",
        "interactions_percentage",
        "key",
        "parameters",
        "redacted",
        "results",
        "target",
        "threshold",
        "total_unique_authors",
        "unique_authors",
        "unique_authors_percentage"
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

            k1 = escapeString(i) + ",";

            const v = k1.slice(0, -1);

            stats.data[v] = stats.data[v] || {};
            stats.data[v].interactions = stats.data[v].interactions || o[i].interactions;
            stats.data[v].unique_authors = stats.data[v].unique_authors || o[i].unique_authors;
          }

          // k2 node
          if (
            o[i].key && o[i].child && o[i].child.results[0] &&
            o[i].child.results[0].child &&
            o[i].child.results[0].child.results[0]
          ) {
            k2 = escapeString(o[i].key) + ",";

            const q = k1 + k2.slice(0, -1);

            stats.data[q] = stats.data[q] || {};
            stats.data[q].interactions = stats.data[q].interactions || o[i].interactions;
            stats.data[q].unique_authors = stats.data[q].unique_authors || o[i].unique_authors;
          }

          // k3 node
          if (o[i].key && o[i].child && o[i].child.results[0] && !o[i].child.results[0].child) {
            k3 = escapeString(o[i].key) + ",";

            const p = k1 + k2 + k3.slice(0, -1);

            stats.data[p] = stats.data[p] || {};
            stats.data[p].interactions = stats.data[p].interactions || o[i].interactions;
            stats.data[p].unique_authors = stats.data[p].unique_authors || o[i].unique_authors;
          }

          // k4 node
          if (o[i].key && !o[i].child) {
            k4 = escapeString(o[i].key) + ",";

            const y = k1 + k2 + k3 + k4.slice(0, -1);

            stats.data[y] = stats.data[y] || {};
            stats.data[y].interactions = stats.data[y].interactions || o[i].interactions;
            stats.data[y].unique_authors = stats.data[y].unique_authors || o[i].unique_authors;

            // store all keys
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
    let csv = "";
    let header = "";
    let counter = 0;

    stats.keys.map(key => {

      const eachKey = key.split(",");
      let keyCount = eachKey.length;
      let last = "";

      eachKey.map(key => {

        counter ++;
        key += ",";
        last += key;

        let bumpKeyCount = false;
        const lastKey = last.slice(0, -1);


        console.log("Testing for:", lastKey);

        // do we have interaction values stored?
        if (stats.data[lastKey]) {

          console.log("  -- yes for:", lastKey);


          // replace any merged key separators
          if(key.includes("__")){
            bumpKeyCount = true;
          }

          key = key.replace("__", ",");

          // add data
          csv += key + stats.data[lastKey].interactions + "," + stats.data[lastKey].unique_authors + ",";

          // only build the header for the number of keys
          if (counter <= keyCount) {

            if(bumpKeyCount === true){
              header += `key${counter},`;
              counter++;
              keyCount++;
            }



            if (keyCount === counter) {
              header += `key${counter},interactions,unique_authors,`;
            } else {
              header += `key${counter},key${counter}_interactions,key${counter}_unique_authors,`;
            }
          }
        } else {
          // must be a merged query name as we dont have any
          // interaction or author records. Just output the name.
          csv += key;

          // header
          if (counter <= keyCount) {
            header += `key${counter},`;
          }
        }
      });

      csv = csv.slice(0, -1);
      csv += "\n";
    });

    csv = header.slice(0, -1) + "\n" + csv;

    console.log("-----------------------------------------------------\n");
    console.log(csv);
    resolve(csv);

  }).catch(e => {
    log.error("Error parsing csv: " + e);
  });
}

exports.jsonToCsv = jsonToCsv;
