'use strict';

module.exports = Literal;

function Literal(value) {
    if (arguments.length !== 1) throw new Error('Literal requires exactly 1 argument');

    const ast = {
        type: 'Literal',
        value
    };

    return ast;
}
