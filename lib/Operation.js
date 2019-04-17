'use strict';

/**
 *
 * Wherein we map the AST factories to the operations.
 *
 * Each will recieve the normalized args for a given expression.
 *
 */

const {
    binary: {
        Equals,
        Eq,
        StrictEquals,
        NotEquals,
        NotEq,
        StrictNotEquals,
        GreaterThan,
        GT,
        GreaterThanOrEqualTo,
        LessThan,
        LT,
        LessThanOrEqualTo,
        LTE,
        Modulus,
        Mod,
        Add,
        Concat,
        Subtract,
        Multiply,
        Divide
    },
    array: {
        Filter,
        Join,
        Every,
        Some,
        Find,
        Map,
        Sum,
        Product
    },
    object: {
        Keys,
        Values
    }
} = require('forast').trees;

const Operation = {
    '==': Equals,
    '===': StrictEquals,
    '!=': NotEquals,
    '!==': StrictNotEquals,
    '>': GreaterThan,
    '>=': GreaterThanOrEqualTo,
    '<': LessThan,
    '<=': LessThanOrEqualTo,
    '%': Modulus,
    '+': Add,
    '-': Subtract,
    '*': Multiply,
    '/': Divide,
    filter: Filter,
    join: Join,
    every: Every,
    some: Some,
    find: Find,
    map: Map,
    sum: Sum,
    concat: Sum,
    product: Product,
    keys: Keys,
    values: Values
};

const ops = new Set(Object.keys(Operation));

module.exports = { Operation, ops };
