'use strict';

module.exports = BinaryExpression;

function BinaryExpression(operator, left, right) {
    if (arguments.length !== 3) throw new Error('BinaryExpression requires exactly 3 arguments');

    const ast = {
        type: 'BinaryExpression',
        left,
        operator,
        right
    };

    return ast;
}
