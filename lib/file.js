"use strict";

const config = require("config");
const moment = require("moment");
const fs = require("fs");
const fse = require("fs-extra");

const log = require("./helpers/logger");

let format = process.env.FORMAT || (config.has("app.format") ? config.get("app.format").toLowerCase() : "json");
const writeConfig = process.env.FORMAT || (config.has("app.write_to_file") ? config.get("app.write_to_file") : "false");
const tableauTemplate = config.has("app.template") ? config.get("app.template") : process.env.NODE_ENV;

const supportedFormats = ["json", "csv"];
const ts = moment().format("YYYY-MM-DD-HH.mm.ss");
const dir = "./output/" + process.env.NODE_ENV + "-" + ts;

function fileExists() {
    try {
        fs.accessSync("./tableau-templates/" + tableauTemplate + ".twb");
        return true;
    } catch (e) {
        return false;
    }
}

if (fileExists() === true && writeConfig === true) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const destFile = dir + "/" + tableauTemplate + ".twb";

    fse.copy("./tableau-templates/" + tableauTemplate + ".twb", destFile, (err) => {
        if (err) {
            log.error("Unable to copy Tableau source file.");
        }

        fs.readFile(destFile, "utf8", (readErr, data) => {
            if (readErr) {
                log.error("Unable to read Tableau source file");
            } else {
                // replace workbook name
                const out = data.replace(/ directory='.*'/g, " directory='.//'");

                fs.writeFile(destFile, out, "utf8", (writeErr) => {
                    if (writeErr) {
                        log.error("Unable to write to Tableau destFile file.");
                    }
                });
            }
        });
    });
}

/**
 * write - files to disk
 * @param fileName - string
 * @param content - string
 * @returns {promise}
 */
const write = function write(fileName, content) {
    return new Promise((resolve, reject) => {
        if (supportedFormats.indexOf(format) === -1) {
            log.warn("Invalid config: app.format. Defaulting to json");
            format = "json";
        }

        if (writeConfig === false) {
            log.trace("Write to disk disabled");
            return resolve(content);
        }

        log.trace("Writing file to disk using format: " + format);

        // pretty print json
        if (format === "json") {
            content = JSON.stringify(content, null, 4);
        }

        if (!fs.existsSync(dir)) {
            try {
                log.trace("Creating dir: " + dir);
                fs.mkdirSync(dir);
            } catch (e) {
                log.error("Error creating directory: " + e);
                reject(e);
            }
        }

        fs.writeFile(dir + "/" + fileName + "." + format, content, "utf8", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
};

exports.write = write;