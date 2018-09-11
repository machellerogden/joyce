'use strict';

/**
 * A Note about AST Factories:
 *
 * The factories exported from this directory must not be defined with rest
 * args or args which specify default values because we depend on function
 * length for introspection.
 *
 */

exports.BinaryExpression = require('./BinaryExpression');
exports.Literal = require('./Literal');
exports.Identifier = require('./Identifier');
