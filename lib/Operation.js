'use strict';

const { BinaryExpression } = require('./ast');
const { partial } = require('./util');

const Operation = {
    Equals: partial(BinaryExpression, '=='),
    StrictEquals: partial(BinaryExpression, '===')
};

module.exports = Operation;
