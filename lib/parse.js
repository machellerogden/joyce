'use strict';

module.exports = parse;

const { isObject } = require('needful');
const AstFromEL = require('./AstFromEL');
const CodeString = require('./CodeString');
const evaluate = require('./evaluate');

function parse(given, prefix, delim) {

    function walk(current, parent, key) {

        if (typeof current === 'string' && current.startsWith(prefix)) {
            const ast = AstFromEL(current, prefix, delim);
            const code = CodeString(ast);
            const value = evaluate(code, given);
            if (parent != null && key != null) {
                parent[key] = value;
            } else {
                current = value;
            }
            return;
        }

        if (current == null || [ 'string', 'number', 'boolean' ].includes(typeof current)) return;

        if (Array.isArray(current)) return current.forEach((v, k) => walk(v, current, k));

        if (typeof current === 'object') return Object.entries(current).forEach(([ k, v ]) => walk(v, current, k));
    }

    walk(given);

    return given;
}
