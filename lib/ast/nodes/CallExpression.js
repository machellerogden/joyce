'use strict';

module.exports = CallExpression;

function CallExpression(callee, args) {
    if (arguments.length <= 0) throw new Error('CallExpression requires at least 1 argument');

    const ast = {
        type: 'CallExpression',
        callee,
        arguments: args
    };

    return ast;
}
