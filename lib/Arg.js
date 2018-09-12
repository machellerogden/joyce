'use strict';

module.exports = Arg;

const {
    Identifier,
    Literal
} = require('require-dir')('./ast/nodes');

const castValue = require('./ast/castValue');

const typeMap = {

    Name: {
        pattern: /^[a-zA-Z_$][0-9a-zA-Z_$\-]*$/,
        cast: Identifier
    },

    String: {
        pattern: /.*/,
        cast: Literal
    },

    Number: {
        pattern: /^(Infinity|[0-9]*)$/,
        cast: v => Literal(Number(v))
    },

    Boolean: {
        pattern: /^(0|1|true|false)$/,
        cast: v => [ 'false', '0' ].includes(v)
            ? Literal(false)
            : Literal(true)
    },

    Object: {
        pattern: /^\{.*\}$/,
        cast: v => {
            try {
                return castValue(JSON.parse(v));
            } catch {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    },

    Array: {
        pattern: /^\[.*\]$/,
        cast: v => {
            try {
                return castValue(JSON.parse(v));
            } catch {
                throw new Error(`unable to parse array: ${v}`);
            }
        }
    },

    Op: {
        pattern: /^(==|===|<|>|<=|>=|%)$/,
        cast: (v) => v
    }

};

function Arg(arg) {

    const types = Object.keys(typeMap);

    const typePattern = new RegExp(`^(${types.join('|')})\\(([^\]*)\\)$`);

    const [ x, type, raw ] = typePattern.exec(arg);

    if (!types.includes(type)) throw new Error(`invalid type \`${type}\` in arg: ${arg}`);

    const argType = typeMap[type];

    if (!argType.pattern.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);

    const value = argType.cast(raw);

    return value;
}
