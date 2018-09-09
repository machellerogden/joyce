'use strict';

const { VM } = require('vm2');

const evaluate = (statement, sandbox) => new VM({ sandbox }).run(statement);

module.exports = evaluate;
