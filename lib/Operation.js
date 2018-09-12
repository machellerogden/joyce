'use strict';

const {
    BinaryExpression,
    FilterByBinaryExpression
} = require('require-dir')('./ast/trees');

const { partial } = require('needful');

const Operation = {
    Equals: partial(BinaryExpression, '=='),
    StrictEquals: partial(BinaryExpression, '==='),
    NotEquals: partial(BinaryExpression, '!='),
    NotStrictEquals: partial(BinaryExpression, '!=='),
    GT: partial(BinaryExpression, '>'),
    GTE: partial(BinaryExpression, '>='),
    LT: partial(BinaryExpression, '<'),
    LTE: partial(BinaryExpression, '<='),
    Filter: FilterByBinaryExpression
};

module.exports = Operation;
