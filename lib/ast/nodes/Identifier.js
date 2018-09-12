'use strict';

module.exports = Identifier;

function Identifier(name, computed = false) {
    if (arguments.length <= 0) throw new Error('Identifier requires at least 1 argument');

    const ast = {
        type: 'Identifier',
        name: typeof name === 'undefined'
            ? 'undefined'
            : name,
        computed
    };

    return ast;
}
