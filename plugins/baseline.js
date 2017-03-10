"use strict";

module.exports = function(
  defaultResponse,
  n, // normalized response
  configValue,
  log,
  task
) {
  return new Promise(function(resolve, reject) {

    log.info("----------------------------------------------------");
    log.info(JSON.stringify(defaultResponse, undefined, 4));
    log.info("----------------------------------------------------");
    log.info(JSON.stringify(n, undefined, 4));
    log.info("----------------------------------------------------");
    log.info(JSON.stringify(configValue, undefined, 4));
    log.info("----------------------------------------------------");
    log.info(JSON.stringify(task, undefined, 4));


    // fraction = unique_authors / sum of unique_authors


    for (let idx in n.data) {



        console.log(idx);
        console.log(n.data[idx]);
      console.log("======");



    }



    resolve(defaultResponse);
  });
};
