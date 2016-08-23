"use strict"

const config = require('config');
const moment = require('moment');
const _ = require('underscore');
const uuid = require('node-uuid');

const log = require("./helpers/logger");

const requestFactory = function(requestParameters){
    log.trace("Creating new request object");
    return new createRequestObject(requestParameters);
};


/**
 * Set defaults and overwrite with task values
 *
 * @param requestParameters
 */
const createRequestObject = function(requestParameters) {

    //console.log("RequestFactory received: ", JSON.stringify(requestParameters, undefined, 4));

    this.localObject = {};
    this.index = (requestParameters.index) ? requestParameters.index.toString() : "default";
    this.api_resource = (requestParameters.api_resource) ? requestParameters.api_resource : ( config.has('index.' + this.index + '.api_resource') ? config.get('index.' + this.index + '.api_resource') : config.get('app.api_resource'));

    //api_resource default is created above. Now set it back on the normalizedTask object so that
    //it is always available throughout later control flow.
    requestParameters.api_resource = this.api_resource;

    this.start = requestParameters.start ? requestParameters.start : config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
    this.end = requestParameters.end ? requestParameters.end : config.has('end') ? config.get('end') : moment.utc().unix();
    this.analysis_type = requestParameters.analysis_type;
    this.target = requestParameters.target;
    this.threshold = requestParameters.threshold || 200;
    this.interval = requestParameters.interval;
    this.span = requestParameters.span || undefined;
    this.user = process.env.AUTH_USER || ( config.has('index.' + this.index + '.auth.username') ? config.get('index.' + this.index + '.auth.username') : (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""));
    this.pass = process.env.AUTH_KEY || ( config.has('index.' + this.index + '.auth.api_key') ? config.get('index.' + this.index + '.auth.api_key') : (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""));
    this.subscription_id = process.env.SUBSCRIPTION_ID || (config.has('index.' + this.index + '.subscription_id') ? config.get('index.' + this.index + '.subscription_id') : (config.has('index.default.subscription_id') ? config.get('index.default.subscription_id') : ""));
    this.filter = requestParameters.filter || undefined;
    this.name = this.localObject.name = requestParameters.name;

    // native nested
    this.l1Child = requestParameters.l1 || undefined;
    this.l1Target = (requestParameters.l1) ? requestParameters.l1.target : undefined;
    this.l1Threshold = (requestParameters.l1 && requestParameters.l1.threshold) ? requestParameters.l1.threshold : 200;
    this.l2Child = requestParameters.l2 || undefined;
    this.l2Target = (requestParameters.l2) ? requestParameters.l2.target : undefined;
    this.l2Threshold = (requestParameters.l2 && requestParameters.l2.threshold) ? requestParameters.l2.threshold : 200;

    log.trace("Creating request with index:         ", this.index);
    log.trace("Creating request with api_resource:  ", this.api_resource);
    log.trace("Creating request with analysis_type: ", this.analysis_type);

    //All request types
    if(requestParameters.then) {
        this.localObject.then = requestParameters.then;
    }

    if(requestParameters.cache) {
        this.localObject.cache = requestParameters.cache;
    }



    //GET_TASK specific
    if(requestParameters.taskId) {
        this.taskId = requestParameters.taskId;
    }



    //Return TASK, GET_TASK or ANALYZE request object
    if(this.api_resource.toLowerCase() === 'analyze'){
        return this.analyze();
    }

    if(this.api_resource.toLowerCase() === 'task'){
        return this.task();
    }

    if(this.api_resource.toLowerCase() === 'get_task'){
        return this.get_task();
    }

};


/**
 * GET /task by ID
 *
 * @returns {{method: string, auth: {user: *, pass: *}, uri: string, json: boolean}}
 */
createRequestObject.prototype.get_task = function(){

    log.trace("Building GET_TASK request...");

    let returnObj = {
        'method': 'GET',
        'auth': {
            'user': this.user,
            'pass': this.pass,
        },
        'uri': "http://api-linkedin-prod.devms.net/v1.4/pylon/linkedin/task/" + this.taskId,
        'json': true
    };

    return returnObj;

};


/**
 * POST /analyze
 *
 * @returns {}
 */
createRequestObject.prototype.analyze = function(){

    log.trace("Building ANALYZE request...");

    let params = { 'target': this.target, 'threshold': this.threshold };

    if(this.analysis_type === "timeSeries"){
        params = { 'interval': this.interval };
        if(this.span) params.span = this.span;
    }

    let returnObj = {
        'method': 'POST',
        'auth': {
            'user': this.user,
            'pass': this.pass,
        },
        'uri': "https://api.datasift.com/v1.3/pylon/analyze",
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

    if(this.filter) {
        returnObj.json.filter = this.filter;
    }

    if(this.l1Child) {
        returnObj.json.parameters.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.l1Target,
                'threshold': this.l1Threshold
            }
        };
    }

    if(this.l2Child) {
        returnObj.json.parameters.child.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.l2Target,
                'threshold': this.l2Threshold
            }
        };
    }

    return _.extend(returnObj, this.localObject);

};


/**
 * POST /task
 *
 * @returns {}
 */
createRequestObject.prototype.task = function(){

    log.trace("Building TASK request...");

    let params = { 'target': this.target, 'threshold': this.threshold };

    if(this.analysis_type === "timeSeries"){
        params = { 'interval': this.interval };
        if(this.span) params.span = this.span;
    }

    let returnObj = {
        'method': 'POST',
        'auth': {
            'user': this.user,
            'pass': this.pass,
        },
        'uri': "",
        'json': {
            'name': 'PEPP_' + uuid.v4(),
            'type': 'analysis',
            'subscription_id': this.subscription_id,
            'parameters': {
                'start': this.start,
                'end': this.end,
                'parameters': {
                    'analysis_type': this.analysis_type,
                    'parameters': params
                }
            }
        }
    };

    if(this.filter) {
        returnObj.json.parameters.filter = this.filter;
    }

    if(this.l1Child) {
        returnObj.json.parameters.parameters.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.l1Target,
                'threshold': this.l1Threshold
            }
        };
    }

    if(this.l2Child) {
        returnObj.json.parameters.parameters.child.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.l2Target,
                'threshold': this.l2Threshold
            }
        };
    }

    return _.extend(returnObj, this.localObject);
};

module.exports.requestFactory = requestFactory;