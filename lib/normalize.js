"use strict";

const config = require("config");

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
 * @param obj
 * @returns {Promise}
 */
function build(obj) {
  console.log(JSON.stringify(obj, undefined, 4));

  let stats = {};

  let splitKeys = 0;
  let splitCount = 0;
  let k4 = "";
  let k3 = "";
  let k2 = "";
  let k1 = "";

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

  let traverse = function traverse(o) {
    for (var i in o) {
      //Merged task?
      if (isValidKey(i) === false && isInt(i) === false) {
        //custom merged will merge result keys with "__"
        k1 = "";
        if (i.includes("__")) {
          let resToSplit = i.split("__");

          //count the number of columns as this can vary
          splitCount = resToSplit.length;

          resToSplit.forEach(function(v) {
            k1 += escapeString(v) + ",";
          });
        } else {
          k1 = escapeString(i) + ",";

          splitCount = 1;
        }
      }

      // k2 node
      if (
        o[i].key &&
        o[i].child &&
        o[i].child.results[0] &&
        o[i].child.results[0].child &&
        o[i].child.results[0].child.results[0]
      ) {
        k2 = escapeString(o[i].key) + ",";
      }

      // k3 node
      if (o[i].key && o[i].child) {
        k3 = escapeString(o[i].key) + ",";
      }

      // k4 node
      if (o[i].key && !o[i].child) {
        splitKeys = 1;

        k4 = escapeString(o[i].key);

        if (k2 !== "") {
          splitKeys++;
        }

        if (k3 !== "") {
          splitKeys++;
        }

        if (k4 !== "") {
          splitKeys += splitCount;
        }

        // a string of the combined keys
        let y = k1 + k2 + k3 + k4;

        stats = stats || {};
        stats.totalAuthors = stats.totalAuthors || 0;
        stats.totalAuthors += o[i].unique_authors;

        stats.totalInteractions = stats.totalInteractions || 0;
        stats.totalInteractions += o[i].interactions;

        stats.data = stats.data || {};
        stats.data[y] = stats.data[y] || {};

        stats.data[y].unique_authors = stats.data[y].unique_authors || 0;
        stats.data[y].unique_authors += o[i].unique_authors;

        stats.data[y].interactions = stats.data[y].interactions || 0;
        stats.data[y].interactions += o[i].interactions;
      }

      if (o[i] !== null && typeof o[i] == "object") {
        traverse(o[i]);
      }
    }
  };

  traverse(obj);

  // snapshot the original data incase its needed
  stats.data_raw = Object.assign({}, obj[0]);

  return stats;
}

exports.build = build;
