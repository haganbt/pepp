"use strict";

const config = require("config");
const moment = require('moment');
const fs = require('fs');
const fse = require('fs-extra');

const log = require("./helpers/logger");

let format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format').toLowerCase() : "json");
let writeConfig = process.env.FORMAT|| (config.has('app.write_to_file') ? config.get('app.write_to_file') : "false");
const supportedFormats = ["json", "csv"];
const ts = moment().format("YYYY-MM-DD-HH.mm.ss");
const dir = "./output/" + process.env.NODE_ENV + "-" + ts;



if(process.env.NODE_ENV.indexOf("tableau") > -1 && writeConfig === true){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let destFile = dir + '/' + process.env.NODE_ENV + '.twb';

    fse.copy('./lib/tableau/standard-tableau.twb', destFile, function (err) {
        if (err) {
            log.error("Unable to copy Tableau source file.");
        }
        fs.readFile(destFile, 'utf8', function (readErr, data) {
            if (readErr) {
                log.error("Unable to read Tableau source file");
            } else {
                //replace workbook name
                let result = data.replace(/standard-tableau/g, process.env.NODE_ENV);
                let out = result.replace(/ directory=''/g, " directory='.//'");
                fs.writeFile(destFile, out, 'utf8', function (writeErr) {
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
    return new Promise(function(resolve, reject){

        if(supportedFormats.indexOf(format) === -1){
            log.warn("Invalid config: app.format. Defaulting to json");
            format = "json";
        }

        if(writeConfig === "false"){
            log.trace("Write to disk disabled");
            return resolve();
        }

        log.trace("Writing file to disk using format: " + format);

        // pretty print json
        if(format === "json"){
            content = JSON.stringify(content, null, 4);
        }

        if (!fs.existsSync(dir)){
            try {
                log.trace("Creating dir: " + dir);
                fs.mkdirSync(dir);
            } catch(e) {
                log.error("Error creating directory: " + e);
                reject(e);
            }
        }

        fs.writeFile(dir + "/" + process.env.NODE_ENV + "-"
            + fileName + "." + format, content, "utf8", function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.write = write;