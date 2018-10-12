'use strict';

module.exports = compile;

const Value = require('./Value');

function compile(...args) {
    if (args.length === 1) return compile(null, args[0], {});
    if (args.length === 2) return typeof args[0] === 'string'
        ? compile(...args, {})
        : compile(null, ...args);

    const [ string, context, options = {} ] = args;
    const pattern = /\(\((["'].*?["'])\)\)|\(\(([^\("']+?)\)\)|\(\((.+)\)\)/g;

    /**
     *    ^
     *   / \
     *    |   So, yeah. It's not really as scary as it looks...
     *    |
     *
     *  Capture group 1: try to lazy match anything inside a (( )) balance group that is surrounded by quotes. The edge case here is that we don't balance the quotes. We could, but who cares... It's invalid at that point anyhow.
     *  Capture group 2: If no match on group 1, try to lazy match anything inside a (( )) balance group unless it contains (, " or '
     *  Capture group 3: If no match on group 2, try to greedy match anything at all inside a (( )) balance group
     *
     *  When processing the results we then do a group 1 | group 2 | group 3 fallback assignment...
     */

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
