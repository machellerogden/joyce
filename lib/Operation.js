'use strict';

const {
    BinaryExpression,
    FilterByBinaryExpression,
    JoinExpression
} = require('forast').trees;

const Template = require('./Template');

const { partial } = require('needful');
const evaluate = require('./evaluate');

const Operation = {
    Equals: partial(BinaryExpression, '=='),
    StrictEquals: partial(BinaryExpression, '==='),
    NotEquals: partial(BinaryExpression, '!='),
    NotStrictEquals: partial(BinaryExpression, '!=='),
    GT: partial(BinaryExpression, '>'),
    GTE: partial(BinaryExpression, '>='),
    LT: partial(BinaryExpression, '<'),
    LTE: partial(BinaryExpression, '<='),
    Filter: FilterByBinaryExpression,
    Join: JoinExpression,
    Template
};

module.exports = Operation;
