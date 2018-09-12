'use strict';

module.exports = AstFromEL;

const Arg = require('./Arg');
const Operation = require('./Operation');

function AstFromEL(str, prefix, delim) {
    const parts = str.replace(new RegExp(`^${prefix}`), '').split(delim);

    if (parts.length < 2) throw new Error(`invalid expression: ${str}`);

    const [ name, ...rawArgs ] = parts;

    const compile = Operation[name];

    if (compile == null) throw new Error(`invalid name: ${name}`);

    return compile(...rawArgs.map(a => Arg(a)));
}
