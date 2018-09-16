'use strict';

module.exports = compile;

const Value = require('./Value');

function compile(context, options = {}) {

    const { prefix = 'Fn::', delim = '::' } = options;

    function traverse(current) {
        if (typeof current === 'string' && current.startsWith(prefix)) return Value(current, context, prefix, delim);
        if (current == null || [ 'string', 'number', 'boolean' ].includes(typeof current)) return current;
        return Object.entries(current).reduce((acc, [ k, v ]) => (acc[k] = traverse(v), acc), Array.isArray(current) ? [] : {});
    }

    return traverse(context);

}
