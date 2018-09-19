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
        FlatMap,
        FlatSum,
        FlatProduct
    }
} = require('forast').trees;

const Template = require('./Template');

const { partial } = require('needful');
const evaluate = require('./evaluate');

const Operation = {
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
    Divide,
    Filter,
    Join,
    Every,
    Some,
    Find,
    Map,
    Sum,
    Product,
    FlatMap,
    FlatSum,
    FlatProduct,
    Template
};

module.exports = Operation;
