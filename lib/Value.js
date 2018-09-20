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

const infer = v => or([ 'Number', 'Boolean', 'Object', 'Array', 'String' ].reduce((acc, type) =>
    or(acc, typeMap[type].test(v) ? typeMap[type].cast(v) : acc), null),
    v);

const typeMap = {

    Ref: {
        test: v => typeof v === 'string',
        cast: (v, context, prefix, delim) => {
            v = (/^\-?(Infinity|[0-9]+)$/.test(v))
                ? `global[${v}]`
                : v;
            const r = evaluate(v, context);
            return (typeof r === 'string' && r.startsWith(prefix))
                ? Value(r, context, prefix, delim)
                : r;
        }
    },

    String: {
        test: v => typeof v === 'string',
        cast: v => v
    },

    Number: {
        test: v => /^\-?(Infinity|[0-9]+)$/.test(v),
        cast: v => Number(v)
    },

    Boolean: {
        test: v => /^(0|1|true|false)$/.test(v),
        cast: v => [ 'false', '0' ].includes(v)
            ? false
            : true
    },

    Object: {
        test: v => /^\{.*\}$/.test(v),
        cast: v => {
            try {
                return JSON.parse(v);
            } catch (e) {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    },

    Array: {
        test: v => /^\[.*\]$/.test(v),
        cast: v => {
            try {
                return JSON.parse(v);
            } catch (e) {
                throw new Error(`unable to parse array: ${v}`);
            }
        }
    },

    Op: {
        test: v => Object.keys(operators).includes(v.toLowerCase()),
        cast: v => operators[v.toLowerCase()]
    }

};

const types = Object.keys(typeMap);

function Arg(arg, context, prefix, delim) {
    const typePattern = new RegExp(`^(${types.join('|')})\\((.*)\\)$`);
    const typeMatch = typePattern.exec(arg);
    if (Array.isArray(typeMatch)) {
        const [ type, raw ] = typeMatch.slice(1)
        if (!types.includes(type)) {
            throw new Error(`Invalid type for \`${type}\` in arg: ${arg}`);
        }
        const argType = typeMap[type];
        if (!argType.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);
        const value = argType.cast(raw, context, prefix, delim);
        return value;
    } else {
        //console.log(`Warning! No type declared for arg: ${arg}`);
        return infer(arg);
    }
}

const OpValueDefaultType = 'Ref';

// the following are defined as functions because we might be able to rearrange
// argument order or change to options pattern for AST factories ... and if we
// do we can change casting based on introspection. That said, it's not possible
// to do dynamic casting just yet...
const OpValue = {
    Template: v => 'String'
};

function AstFromEL(str, context, prefix, delim) {
    const parts = str.split(delim);
    if (parts.length < 1) throw new Error(`invalid expression: ${str}`);
    const opParts = /^(.*)\((.*)\)$/.exec(parts[0]);
    const [ name, ...rawArgs ] = Array.isArray(opParts)
        ? [ opParts[1], ...[
                `${typeof OpValue[opParts[1]] === 'function'
                    && OpValue[opParts[1]](opParts[2])
                    || OpValueDefaultType
                  }(${opParts[2]})`,
                ...parts.slice(1)
            ]
          ]
        : parts;
    const compile = Operation[name];
    if (compile == null) throw new Error(`invalid name: ${name}`);
    return compile(...rawArgs.map(a => Arg(a, context, prefix, delim)));
}

function Value(value, context, prefix, delim) {
    if (typeof value === 'string' && value.startsWith(prefix)) {
        const str = value.replace(new RegExp(`^${prefix}`), '');
        const ast = AstFromEL(str, context, prefix, delim);
        //console.log(require('util').inspect(ast, { depth: null, colors: true }));
        const program = Program(ast);
        const code = astring.generate(program);
        return evaluate(code, context);
    } else {
        return value;
    }
}
