'use strict';

module.exports = ObjectExpression;

function ObjectExpression(properties) {
    if (arguments.length !== 1) throw new Error('ObjectExpression requires exactly 1 argument');

    const ast = {
        type: 'ObjectExpression',
        properties
    };

    return ast;
}
