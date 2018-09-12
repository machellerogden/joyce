'use strict';

module.exports = ArrayExpression;

function ArrayExpression(elements) {
    if (arguments.length !== 1) throw new Error('ArrayExpression requires exactly 1 argument');

    const ast = {
        type: 'ArrayExpression',
        elements: Array.isArray(elements)
            ? elements
            : [ elements ]
    };

    return ast;
}
