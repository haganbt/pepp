"use strict";

const defaultOperator = "==";

const operatorTargets = {
    "fb.content": "any",
    "fb.parent.content": "any",
    "interaction.content": "any",
    "interaction.raw_content": "any"
};

/**
 * get - lookup the set operator for a given target
 *
 * @param target - string
 * @returns string
 */
const get = function get(target) {
    if (operatorTargets.hasOwnProperty(target)) {
        return operatorTargets[target];
    }
    return defaultOperator;
};

exports.get = get;
