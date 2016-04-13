"use strict";

const request = require('../request');
const log = require("./logger");

const url = "https://gist.githubusercontent.com/haganbt/373eae79a994762f7fd02d71edbce641/raw/056f969908a1121f6a33a0b44c85f267caaa083b/demo.json";

const getRemote = function getRemote() {

    return request.make(url)
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            log.error("Error loading remote config file: " + err);
        });
};

exports.getRemote = getRemote;
