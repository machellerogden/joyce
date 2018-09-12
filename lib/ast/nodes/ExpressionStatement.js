'use strict';

module.exports = ExpressionStatement;

function ExpressionStatement(expression) {
    if (arguments.length !== 1) throw new Error('ExpressionStatement requires exactly 1 argument');

    const ast = {
        type: 'ExpressionStatement',
        expression
    };

    return ast;
}
