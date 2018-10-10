'use strict';

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
        Product,
        FlatMap
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
    product: Product,
    flatmap: FlatMap,
    template: require('./Template')
};

module.exports = Operation;
