'use strict';

module.exports = Value;

const astring = require('astring');
const {
    nodes: {
        Program
    },
    cast
} = require('forast');

const Operation = require('./Operation');
const evaluate = require('./evaluate');
const { or } = require('needful');

const operators = {
    equals: '===',
    eq: '==',
    gt: '>',
    greaterthan: '>',
    lt: '<',
    lessthan: '<',
    gte: '>=',
    lte: '<=',
    mod: '%',
    plus: '+',
    concat: '+',
    minus: '-',
    multiply: '*',
    divide: '/'
};

const infer = (v, context, pattern) =>
    or([ 'number', 'boolean', 'object', 'array', 'op', 'ref', 'string' ].reduce((acc, type, i, arr) =>
        acc == null
            ? typeMap[type].test(v)
                ? typeMap[type].cast(v, context, pattern)
                : acc
            : acc,
        null), v);

const typeMap = {

    ref: {
        test: v => typeof v === 'string' && !([ "'", '"' ].includes(v.charAt(0)) && [ "'", '"' ].includes(v.charAt(v.length -1))),
        cast: (v, context, pattern) => {
            v = /^\-?(Infinity|[0-9]+)$|^['"].*['"]$/.test(v)
                ? `context[${v}]`
                : `context.${v}`
            const r = evaluate(v, context);
            return (typeof r === 'string' && pattern.test(r))
                ? (pattern.lastIndex = 0, Value(r, context, pattern))
                : r;
        }
    },

    string: {
        test: v => typeof v === 'string',
        cast: v => [ "'", '"' ].includes(v.charAt(0)) && [ "'", '"' ].includes(v.charAt(v.length -1))
            ? v.slice(1,-1)
            : v
    },

    number: {
        test: v => /^\-?(Infinity|[0-9]+)$/.test(v),
        cast: v => Number(v)
    },

    boolean: {
        test: v => /^(0|1|true|false)$/.test(v),
        cast: v => [ 'false', '0' ].includes(v)
            ? false
            : true
    },

    object: {
        test: v => /^\{.*\}$/.test(v),
        cast: v => {
            try {
                return JSON.parse(v);
            } catch (e) {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    },

    array: {
        test: v => /^\[.*\]$/.test(v),
        cast: v => {
            try {
                return JSON.parse(v);
            } catch (e) {
                throw new Error(`unable to parse array: ${v}`);
            }
        }
    },

    op: {
        test: v => [ ...Object.values(operators), ...Object.keys(operators) ].includes(v.toLowerCase()),
        cast: v => operators[v.toLowerCase()] || v
    }

};

const types = Object.keys(typeMap);

function Arg(arg, context, pattern) {
    const typePattern = new RegExp(`^(${types.join('|')})\\((.*)\\)$`, 'i');
    const typeMatch = typePattern.exec(arg);
    if (typeMatch != null) {
        const [ type, raw ] = [ typeMatch[1].toLowerCase(), typeMatch[2] ];
        if (!types.includes(type)) throw new Error(`Invalid type for \`${type}\` in arg: ${arg}`);
        const argType = typeMap[type];
        if (type !== 'ref' && !argType.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);
        const value = argType.cast(raw, context, pattern);
        return value;
    } else {
        const value = infer(arg, context, pattern);
        if (process.env.JOYCE_DEBUG) console.log(`Warning! No type was declared for arg \`${arg}\`. Resolving as \`${value}\``);
        return value;
    }
}

function AstFromEL(str, context, pattern) {
    const parts = str.match(/(?:[^\s"]+|"[^\\"]*")+/g); // split on spaces but account for quotes and escaped quotes
    if (parts.length < 1) throw new Error(`invalid expression: ${str}`);
    if (parts.length === 1) {
        const r = cast(Arg(parts[0], context, pattern));
        return r;
    } else {
        const [ rawOp, ...rawArgs ] = parts;
        const op = rawOp.toLowerCase();
        const compile = Operation[op];
        if (compile == null) throw new Error(`invalid op: ${op}`);
        const args = rawArgs.map(a => Arg(a, context, pattern))
        return compile(...args);
    }
}

function Value(value, context, pattern) {
    let hits = [];
    const parts = [];
    pattern.lastIndex = 0;
    if (typeof value === 'string' && value.includes('((')) {
        let hit;
        while (hit = pattern.exec(value)) {
            const [ match, a, b, c ] = hit;
            const body = a || b || c;
            const pre = value.slice((hits[hits.length - 1] || {}).lastIndex || 0, hit.index);
            const result = {
                pre,
                body,
                match,
                index: hit.index,
                lastIndex: pattern.lastIndex
            };
            hits.push(result);
        }
        pattern.lastIndex = 0;
        if (hits.length) {
            const results = hits.map((hit, i) => {
                const { pre, body, match, lastIndex } = hit;
                const post = (i === hits.length - 1)
                    ? value.slice(match.length + hit.index)
                    : '';
                const ast = AstFromEL(body, context, pattern);
                const program = Program(ast);
                const code = astring.generate(program);
                const evaluated = evaluate(code, context);
                return pre || post
                    ? `${pre}${evaluated}${post}`
                    : evaluated;
            });
            return results.length > 1
                ? results.join('')
                : results[0];
        }
    }
    return value;
}
