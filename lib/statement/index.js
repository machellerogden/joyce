'use strict';
/**
 * A Note about Statement Factories
 *
 * Can not be defined with rest args or args with default values because
 * we depend on function length for introspection.
 */

exports.BinaryExpression = require('./BinaryExpression');
