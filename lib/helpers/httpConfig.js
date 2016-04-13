"use strict";

const request = require('../request');
const log = require("./logger");

const url = "https://gist.githubusercontent.com/haganbt/373eae79a994762f7fd02d71edbce641/raw/3683be4134e582c92013291df7b02ece04eefc5e/demo.json";

const getRemote = function getRemote() {

    return request.make(url)
        .then(function (data) {
            return data;

        })
        .catch(function (err) {
            log.error("Error loading external config file: " + err);
        });
};

exports.getRemote = getRemote;

console.log(getRemote());

