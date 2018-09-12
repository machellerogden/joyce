'use strict';

module.exports = CodeString;

const astring = require('astring');
const Program = require('./ast/nodes/Program');

function CodeString(ast) {
    const program = Program(ast);
    const code = astring.generate(program);
    return code;
}
