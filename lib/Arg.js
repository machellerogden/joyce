'use strict';

module.exports = Arg;

const Identifier = require('./Identifier');
const Literal = require('./Literal');

const typeMap = {

    Name: {
        pattern: '^[a-zA-Z_$][0-9a-zA-Z_$\-]*$',
        cast: Identifier
    },

    String: {
        pattern: '.*',
        cast: Literal
    },

    Number: {
        pattern: '^(Infinity|[0-9]*)$',
        cast: Literal
    },

    Boolean: {
        pattern: '^(0|1|true|false)$',
        cast: v => [ 'false', '0' ].includes(v)
            ? false
            : true
    },

    Object: {
        pattern: '^[\[\{].*[\]\}]$',
        cast: v => {
            try {
                return JSON.parse(v); // maybe leave as string and delegate ast gen to acorn
            } catch {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    }

};

function Arg(arg) {

    const types = Object.keys(typeMap);

    const typePattern = new RegExp(`^(${types.join('|')})\\(([^\]*)\\)$`);

    const [ x, type, raw ] = typePattern.exec(arg);

    if (!types.includes(type)) throw new Error(`invalid type \`${type}\` in arg: ${arg}`);

    const argType = typeMap[type];

    const valuePattern = new RegExp(argType.pattern);

    if (!valuePattern.test(raw)) throw new Error(`invalid value \`${raw}\` in arg: ${arg}`);

    const value = argType.cast(raw);

    return value;
}
