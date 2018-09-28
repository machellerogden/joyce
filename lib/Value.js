'use strict';

module.exports = Value;

const astring = require('astring');
const { nodes: { Program } } = require('forast');
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

const infer = (v, context, prefix) =>
    or([ 'number', 'boolean', 'object', 'array', 'op', 'ref', 'string' ].reduce((acc, type, i, arr) =>
        acc == null
            ? typeMap[type].test(v)
                ? typeMap[type].cast(v, context, prefix)
                : acc
            : acc,
        null), v);

const typeMap = {

    ref: {
        test: v => typeof v === 'string' && !([ "'", '"' ].includes(v.charAt(0)) && [ "'", '"' ].includes(v.charAt(v.length -1))),
        cast: (v, context, prefix) => {
            v = (/^\-?(Infinity|[0-9]+)$/.test(v))
                ? `global[${v}]`
                : v;
            const r = evaluate(v, context);
            return (typeof r === 'string' && r.startsWith(prefix))
                ? Value(r, context, prefix)
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

function Arg(arg, context, prefix) {
    const typePattern = new RegExp(`^(${types.join('|')})\\((.*)\\)$`, 'i');
    const typeMatch = typePattern.exec(arg);
    if (Array.isArray(typeMatch)) {
        const [ type, raw ] = [ typeMatch[1].toLowerCase(), typeMatch[2] ];
        if (!types.includes(type)) throw new Error(`Invalid type for \`${type}\` in arg: ${arg}`);
        const argType = typeMap[type];
        if (!argType.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);
        const value = argType.cast(raw, context, prefix);
        return value;
    } else {
        const value = infer(arg, context, prefix);
        if (process.env.JOYCE_DEBUG) console.log(`Warning! No type was declared for arg \`${arg}\`. Resolving as \`${value}\``);
        return value;
    }
}

function AstFromEL(str, context, prefix) {
    const parts = str.match(/(?:[^\s"]+|"[^\\"]*")+/g);
    if (parts.length < 1) throw new Error(`invalid expression: ${str}`);
    const [ rawName, ...rawArgs ] = parts;
    const name = rawName.toLowerCase();
    const compile = Operation[name];
    if (compile == null) throw new Error(`invalid name: ${name}`);
    const args = rawArgs.map(a => Arg(a, context, prefix))
    return compile(...args);
}

function Value(value, context, prefix) {
    if (typeof value === 'string' && value.startsWith(prefix)) {
        const str = value.replace(new RegExp(`^${prefix}`), '');
        const ast = AstFromEL(str, context, prefix);
        if (process.env.JOYCE_DEBUG) console.log(require('util').inspect(ast, { depth: null, colors: true }));
        const program = Program(ast);
        const code = astring.generate(program);
        return evaluate(code, context);
    } else {
        return value;
    }
}
