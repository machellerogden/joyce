'use strict';

const { BinaryExpression } = require('./statement');
const { partial } = require('./util');

const Operation = {
    Equals: partial(BinaryExpression, '=='),
    StrictEquals: partial(BinaryExpression, '===')
};

module.exports = Operation;
