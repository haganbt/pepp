"use strict";
process.env.NODE_ENV === undefined ? process.env.NODE_ENV = "demo" : "";


const _ = require('underscore');
const httpConfig = require('./lib/helpers/httpConfig');
let config = require('config');

var util = require('util')
var merge = require('deepmerge')


httpConfig.getRemote().then( data => {

    try {

    } catch (e){

    }
    let w = JSON.parse(data);


    //_.extend(config, w);


    //console.log(util.inspect(merge(config, w), false, null))

    console.log(JSON.stringify(merge(config, w), undefined, 4));



});




