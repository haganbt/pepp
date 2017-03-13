"use strict";

// spinners and counter
const Spinner = require("cli-spinner").Spinner;
const spinner = new Spinner();

spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");

const start = function start() {
    spinner.start();
};

const stop = function stop() {
    spinner.stop();
};

const update = function update(title) {
    spinner.setSpinnerTitle(title);
};

const isSpinning = function isSpinning() {
    return spinner.isSpinning();
};

exports.start = start;
exports.stop = stop;
exports.update = update;
exports.isSpinning = isSpinning;
