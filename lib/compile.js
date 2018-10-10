'use strict';

module.exports = compile;

const Value = require('./Value');

function compile(...args) {
    if (args.length === 1) return compile(null, args[0], {});
    if (args.length === 2) return typeof args[0] === 'string'
        ? compile(...args, {})
        : compile(null, ...args);

    const [ string, context, options = {} ] = args;
    const pattern = /\(\((.+)\)\)/;

    function walk(current) {
        if (typeof current === 'string' && pattern.test(current)) return Value(current, context, pattern);
        if (current == null || [ 'string', 'number', 'boolean' ].includes(typeof current)) return current;
        return Object.entries(current).reduce((acc, [ k, v ]) => (acc[k] = walk(v), acc), Array.isArray(current) ? [] : {});
    }

    const subject = typeof string == 'string'
        ? string
        : context;

    return walk(subject);

}
