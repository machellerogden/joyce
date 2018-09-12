'use strict';

module.exports = ArrowFunctionExpression;

function ArrowFunctionExpression(body, params = [], expression = true) {
    if (arguments.length <= 0) throw new Error('ArrowFunctionExpression requires at least 1 argument');

    const ast = {
        type: 'ArrowFunctionExpression',
        params,
        body,
        expression
    };

    return ast;
}
