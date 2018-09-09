'use strict';

module.exports = parse;

const { isEL, isObject } = require('./util');
const Value = require('./Value');

function parse(given) {

    function walk(current, parent, key) {

        if (typeof current === 'string' && isEL(current)) {
            const value = Value(current);
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
