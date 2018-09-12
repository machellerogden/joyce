'use strict';

const { ExpressionStatement, BinaryExpression } = require('require-dir')('../nodes');
const { compose } = require('needful');

module.exports = compose(ExpressionStatement, BinaryExpression);
