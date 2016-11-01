"use strict";

module.exports = function() {
    console.log("********************************");
    return new Promise(function(resolve, reject) {
        console.log("********************************");
        setTimeout(resolve, 200, 'example plugin succeeded!');

    });
};

