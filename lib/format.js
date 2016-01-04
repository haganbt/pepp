"use strict";

const config = require("config");
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const format = process.env.FORMAT || (config.has('app.format') ? config.get('app.format') : "json");


/**
 * isUnixTs - check if valid unix TS
 *
 * @param input - {*}
 * @returns - boolean
 */
function isUnixTs(input){
    return(moment.unix(input).isValid());
}


/**
 * unixToHuman - convert unix TS to human readable format
 *
 * @param unixTs - int
 * @returns - moment object
 */
function unixToHuman(unixTs){
    return new moment.unix(unixTs).utc().format('YYYY-MM-DD HH:mm:ss');
}


function getType(obj) {
    return Object.prototype.toString.call(obj);
}


/**
 * hasChildArray - diffrenciate between nested
 * array format and array.
 *
 * See /test/unitformat.test.js for supported formats
 *
 * @param obj
 * @returns {boolean}
 */
function hasChildArray(obj){
    let p = false;
    let t = _.values(obj[0]);

    t.map(function(x){
        if(typeof(x) === "object") {
            p = true;
        }
    });

    return p;
}


/**
 * jsonToCsv - convert json to csv.
 * See /test/unitformat.test.js for supported formats
 *
 * @param inObj
 * @returns {Promise|Promise.<T>}
 */
const jsonToCsv = function jsonToCsv(inObj) {
    return new Promise(function(resolve, reject){

        if(format !=='csv'){
            reject();
        }

        let out = "";

        if(hasChildArray(inObj)===true){
            out = "category,key,interactions,unique_authors\n";
            for(let idx in inObj[0]){
                let childArr = inObj[0][idx];
                for(let childIdx in childArr){
                    out += idx + "," + _.values(childArr[childIdx]).toString() + "\n";
                }
            }
        } else {
            out = "key,interactions,unique_authors\n";
            inObj.map(function(row){
                out += _.values(row).toString() + "\n";
            });

        }
        resolve(out);
    })
    .catch(function(e){
        log.error(e);
    });
};

exports.jsonToCsv = jsonToCsv;