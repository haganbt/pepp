"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || "demo";

const _ = require("underscore");
const figlet = require("figlet");
const bytes = require("bytes");
const plugins = require("require-all")(__dirname + "/plugins");

const taskManager = require("./lib/taskManager");
const queue = require("./lib/queue");
const log = require("./lib/helpers/logger");
const requestStats = require("./lib/helpers/requestStats");
const cacheHelper = require("./lib/helpers/cache");
const format = require("./lib/format");
const normalize = require("./lib/normalize");
const file = require("./lib/file");
const requestFactory = require("./lib/requestFactory").requestFactory;
const spinner = require("./lib/helpers/spinner");

spinner.start();
log.info(figlet.textSync(process.env.NODE_ENV));
console.log("\n\n");

const normalizedTasks = taskManager.loadConfigTasks();

normalizedTasks.forEach(task => {
  const reqObj = requestFactory(task);

  queue
    .queueRequest(reqObj, task)
    .then(response => {
      spinner.stop();


      console.log("===================================");

      console.log(response);

      console.log("===================================");



      //handle expected unresolved promises caused by recursion
      if (response === undefined || _.isEmpty(response)) {
        return;
      }

      cacheHelper.debugAll();

      return response;
    })
    .then(response => {
      // Build a simple results object for plugins
      return new Promise(resolve => {

        // Handle expected unresolved promises caused by recursion
        // - merged queries
        if (response === undefined || _.isEmpty(response)) {
          return;
        }

        return resolve([response, normalize.build(response)]);
      });
    })
    .then(function([response, normalizedResponse]) {
      return new Promise(resolve => {

          return format.jsonToCsv(response, task).then(response => {
            return resolve([response, normalizedResponse]);
          });
      });
    })
    .then(function([response, normalizedResponse]) {

      if (!task.plugin) {
        return response;
      }

      let pluginKey = Object.keys(task.plugin)[0];
      let pluginValue = task.plugin[pluginKey];

      if (!plugins[pluginKey]) {
        return Promise.reject("Plugin not found: " + pluginKey);
      }

      // execute plugin
      return plugins[pluginKey](response, normalizedResponse, pluginValue, log, task)
        .catch(err => {
          return Promise.reject(pluginKey + " plugin error: " + err);
        });
    })
    .then(response => {
      return file.write(reqObj.name, response);
    })
    .then(response => {
      if (_.isObject(response)) {
        log.info(JSON.stringify(response, undefined, 4));
      }

      if (_.isString(response)) {
        if (response.length >= 50000) {
          let b = Buffer.byteLength(response, "utf8");
          log.info(response.substring(0, 800) + "....");
          log.warn(
            "Large file output generated (" +
              bytes(b) +
              "), redacting from console."
          );
        } else {
          log.info(response);
        }
      }

      log.info("Request Summary:");
      log.info(requestStats.get());
    })
    .catch(err => {
      spinner.stop();

      log.error(JSON.stringify(err, undefined, 4));
    });
});
