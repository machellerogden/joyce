'use strict';

module.exports = Value;

const astring = require('astring');
const { cast, nodes: { Program, Identifier, Literal } } = require('forast');
const Operation = require('./Operation');
const evaluate = require('./evaluate');

const operators = {
    equals: '===',
    eq: '==',
    gt: '>',
    greaterthan: '>',
    lt: '<',
    lessthan: '<',
    gte: '>=',
    lte: '<=',
    mod: '%'
};

const typeMap = {

    Ref: {
        test: v => typeof v === 'string',
        cast: (v, context, prefix, delim) => {
            const r = evaluate(v, context);
            if (typeof r === 'string' && r.startsWith(prefix)) {
                return cast(Value(r, context, prefix, delim));
            } else {
                return cast(r);
            }
        }
    },

    String: {
        test: v => typeof v === 'string',
        cast: v => Literal(v)
    },

    Number: {
        test: v => /^\-?(Infinity|[0-9]*)$/.test(v),
        cast: v => Literal(Number(v))
    },

    Boolean: {
        test: v => /^(0|1|true|false)$/.test(v),
        cast: v => [ 'false', '0' ].includes(v)
            ? Literal(false)
            : Literal(true)
    },

    Object: {
        test: v => /^\{.*\}$/.test(v),
        cast: v => {
            try {
                return cast(JSON.parse(v));
            } catch {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    },

    Array: {
        test: v => /^\[.*\]$/.test(v),
        cast: v => {
            try {
                return cast(JSON.parse(v));
            } catch {
                throw new Error(`unable to parse array: ${v}`);
            }
        }
    },

    Op: {
        test: v => Object.keys(operators).includes(v),
        cast: v => operators[v]
    }

};

function Arg(arg, context, prefix, delim) {
    const types = Object.keys(typeMap);
    const typePattern = new RegExp(`^(${types.join('|')})\\(([^\]*)\\)$`);
    const typeMatch = typePattern.exec(arg);
    const [ type, raw ] = Array.isArray(typeMatch)
        ? typeMatch.slice(1)
        : [ 'Op', arg.toLowerCase() ];
    if (!types.includes(type)) throw new Error(`invalid type \`${type}\` in arg: ${arg}`);
    const argType = typeMap[type];
    if (!argType.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);
    const value = argType.cast(raw, context, prefix, delim);
    return value;
}

function AstFromEL(str, context, prefix, delim) {
    const parts = str.split(delim);
    if (parts.length < 2) throw new Error(`invalid expression: ${str}`);
    const nameWithArgs = /^(.*)\((.*)\)$/.exec(parts[0]);
    const [ name, ...rawArgs ] = Array.isArray(nameWithArgs)
        ? [ nameWithArgs[1], ...[ `String(${nameWithArgs[2]})`, ...parts.slice(1) ] ]
        : parts;
    const compile = Operation[name];
    if (compile == null) throw new Error(`invalid name: ${name}`);
    return compile(...rawArgs.map(a => Arg(a, context, prefix, delim)));
}

function Value(value, context, prefix, delim) {
    if (typeof value === 'string' && value.startsWith(prefix)) {
        const str = value.replace(new RegExp(`^${prefix}`), '');
        const ast = AstFromEL(str, context, prefix, delim);
        const program = Program(ast);
        const code = astring.generate(program);
        return evaluate(code, context);
    } else {
        return value;
    }
}
