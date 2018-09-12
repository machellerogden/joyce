'use strict';

module.exports = Program;

function Program(statements) {
    if (arguments.length !== 1) throw new Error('Program requires exactly 1 argument');

    const ast = {
        type: 'Program',
        body: Array.isArray(statements)
            ? statements
            : [ statements ],
        sourceType: 'script'
    };

    return ast;
}
