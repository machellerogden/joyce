'use strict';

module.exports = BinaryExpression;

const astring = require('astring');

function BinaryExpression(operator, left, right) {
    if (arguments.length !== 3) throw new Error('BinaryExpression requires exactly 3 arguments');

    const expression = {
        type: 'BinaryExpression',
        left,
        operator,
        right
    };

    const statement = {
        type: 'ExpressionStatement',
        expression
    };

    const ast = {
        type: 'Program',
        body: [ statement ]
    };

    const code = astring.generate(ast);

    return code;
}
