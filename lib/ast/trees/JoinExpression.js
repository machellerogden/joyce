'use strict';

const cast = require('../cast');
const { compose } = require('needful');
const {
    ExpressionStatement,
    CallExpression,
    MemberExpression,
    Identifier,
    ArrowFunctionExpression
} = require('require-dir')('../nodes');

module.exports = (delim, arr) => compose(
        ExpressionStatement,
        CallExpression)(
            MemberExpression(
                cast(arr), Identifier('join')),
                [ cast(delim) ]);
