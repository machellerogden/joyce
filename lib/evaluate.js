'use strict';

const { VM } = require('vm2');

const evaluate = (statement, context) => {
    if (typeof context !== 'object') context = {};
    return new VM({ sandbox: { context } }).run(statement);
};

module.exports = evaluate;
