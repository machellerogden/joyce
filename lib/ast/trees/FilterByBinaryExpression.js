'use strict';

const cast = require('../cast');
const { compose } = require('needful');
const {
    ExpressionStatement,
    CallExpression,
    MemberExpression,
    Identifier,
    ArrowFunctionExpression,
    BinaryExpression
} = require('require-dir')('../nodes');

module.exports = (operator, arr, testValue) => compose(
        ExpressionStatement,
        CallExpression)(
            MemberExpression(
                cast(arr), Identifier('filter')),
                [ ArrowFunctionExpression(
                    BinaryExpression(operator, Identifier('v'), cast(testValue)),
                    [ Identifier('v') ]) ]);
