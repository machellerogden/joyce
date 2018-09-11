'use strict';

module.exports = parse;

const { isObject } = require('./util');
const CodeString = require('./CodeString');
const evaluate = require('./evaluate');

function parse(given, prefix) {

    function walk(current, parent, key) {

        if (typeof current === 'string' && current.startsWith(`${prefix}::`)) {
            const code = CodeString(current);
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

        if (current != null && typeof current === 'object') return Object.entries(current).forEach(([ k, v ]) => walk(v, current, k));
    }

    walk(given);

    return given;
}
