"use strict"

const config = require('config');
const moment = require('moment');

const log = require("./helpers/logger");

const requestFactory = function(requestParameters){
    log.trace("Creating new request object");
    return new createRequestObject(requestParameters);
};

const createRequestObject = function(requestParameters) {
    this.localObject = {};
    this.index = (requestParameters.index) ? requestParameters.index.toString() : undefined;
    this.start = config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
    this.end = config.has('end') ? config.get('end') : moment.utc().unix();
    this.uri = requestParameters.uri || undefined;
    this.analysis_type = requestParameters.analysis_type;
    this.target = requestParameters.target;
    this.threshold = requestParameters.threshold || 200;
    this.interval = requestParameters.interval;
    this.span = requestParameters.span || undefined;
    this.user = process.env.AUTH_USER || ( config.has('index.' + this.index + '.auth.username') ? config.get('index.' + this.index + '.auth.username') : (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""));
    this.pass = process.env.AUTH_KEY || ( config.has('index.' + this.index + '.auth.api_key') ? config.get('index.' + this.index + '.auth.api_key') : (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""));
    this.subscription_id = process.env.AUTH_KEY || (config.has('index.' + this.index + '.subscription_id') ? config.get('index.' + this.index + '.subscription_id') : (config.has('index.default.subscription_id') ? config.get('index.default.subscription_id') : ""));

    //todo analyze_uri
};

createRequestObject.prototype.analyze = function(){

    let params = { 'target': this.target, 'threshold': this.threshold };

    if(this.analysis_type === "timeSeries"){
        params = { 'interval': this.interval };
        if(this.span) params.span = this.span;
    }

    this.localObject = {
        'method': 'POST',
        'auth': {
            'user': this.user,
            'pass': this.pass,
        },
        'uri': this.uri || "https://api.datasift.com/v1.3/pylon/analyze",
        'json': {
            'id': this.subscription_id,
            'start': this.start,
            'end': this.end,
            'parameters': {
                'analysis_type': this.analysis_type,
                'parameters': params
            }
        }
    };

    return this.localObject;
};

createRequestObject.prototype.task = function(){
    return this.localObject;
};

module.exports.requestFactory = requestFactory;
