'use strict';

module.exports = Value;

const Arg = require('./Arg');
const Operation = require('./Operation');

function Value(v) {
    const parts = v.split('::');

    if (parts.length < 2) throw new Error(`invalid expression: ${v}`);

    const [ name, ...rawArgs ] = parts.slice(1);

    const compile = Operation[name];

    if (compile == null) throw new Error(`invalid name: ${name}`);

    if (compile.length !== rawArgs.length) throw new Error(`expected ${compile.length} args but received ${rawArgs.length} in expression: ${v}`);

    return compile(...rawArgs.map(a => Arg(a)));
}
