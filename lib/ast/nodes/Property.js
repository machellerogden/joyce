'use strict';

module.exports = Property;

const Identifier = require('./Identifier');

function Property(name, value) {
    if (arguments.length !== 2) throw new Error('Property requires exactly 2 arguments');

    const ast = {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        key: Identifier(name),
        value, // must be one of: Literal, ObjectExpression, ArrayExpression
        kind: 'init'
    };

    return ast;
}
