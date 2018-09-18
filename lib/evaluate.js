'use strict';

const { VM } = require('vm2');

const evaluate = (statement, sandbox) => {
    if (typeof sandbox !== 'object') sandbox = {};
    return new VM({ sandbox }).run(statement);
};

module.exports = evaluate;
