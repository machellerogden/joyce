'use strict';

module.exports = Value;

const astring = require('astring');
const { nodes: { Program }, cast } = require('forast');
const { Operation, ops } = require('./Operation');
const evaluate = require('./evaluate');
const whitespace = new Set([ ':' ]);

/**
 *
 * EL Pattern
 *
 * Balance groups are not supported by JS, so we work around it.
 *
 * Capture group 1: try to lazy match anything inside a (( )) balance group that is surrounded by quotes. The edge case here is that we don't balance the quotes. We could, but who cares... It's invalid at that point anyhow.
 * Capture group 2: If no match on group 1, try to lazy match anything inside a (( )) balance group unless it contains (, " or '
 * Capture group 3: If no match on group 2, try to greedy match anything at all inside a (( )) balance group
 *
 * When processing the results we then do a group 1 | group 2 | group 3 fallback assignment...
 *
 * We define as a function because exec usage of patterns is stateful.
 *
 */
const EL = () => /{{(["'].*?["'])}}|{{([^{"']+?)}}|{{(.+)}}/g;

/**
 *
 * SPLIT Pattern
 *
 * Again, because balance groups are not supported in JS, we work around it.
 *
 * 1: Try to greedy match any character except for whitespace or quotes.
 * 2: If no match, try to greedy match anything surrounded by quotes and between the quotes match any character expect escaped quotes.
 * 3: Group both of the above and greedy match.
 *
 * Exported directly because we don't capture and we just use with match, not with exec.
 *
 */
const SPLIT = /(?:[^\s"']+|["'][^\\"\\']*["'])+/g;

const typeMap = {

    num: {
        test: v => /^\-?(Infinity|[0-9]+)$/.test(v),
        cast: v => Number(v)
    },

    bool: {
        test: v => /^(0|1|true|false)$/.test(v),
        cast: v => [ 'false', '0' ].includes(v)
            ? false
            : true
    },

    obj: {
        test: v => /^\{.*\}$/.test(v),
        cast: v => {
            try {
                return JSON.parse(v);
            } catch (e) {
                throw new Error(`unable to parse object: ${v}`);
            }
        }
    },

    arr: {
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
        test: v => [
            '===',
            '==',
            '>',
            '>',
            '<',
            '<',
            '>=',
            '<=',
            '%',
            '+',
            '+',
            '-',
            '*',
            '/'
        ].includes(v),
        cast: v => v
    },

    ref: {
        test: v => typeof v === 'string' && !([ "'", '"' ].includes(v.charAt(0)) && [ "'", '"' ].includes(v.charAt(v.length -1))),
        cast: (v, context) => {
            v = /^\-?(Infinity|[0-9]+)$|^['"].*['"]$/.test(v)
                ? `context[${v}]`
                : `context.${v}`
            const r = evaluate(v, context);
            return (typeof r === 'string')
                ? Value(r, context)
                : r;
        }
    },

    str: {
        test: v => typeof v === 'string',
        cast: (v, _, unquote) => unquote
            ? [ "'", '"' ].includes(v.charAt(0)) && [ "'", '"' ].includes(v.charAt(v.length -1))
                ? v.slice(1,-1)
                : v
            : v
    }

};

/**
 * We're counting on ES6 spec for stable object traversal to be upheld by the compiler.
 * Type inference is an ordered cascade.
 */
const types = Object.keys(typeMap);

const infer = (v, context) => {
    const match = types.reduce((acc, type, i, arr) =>
        acc == null
            ? typeMap[type].test(v)
                ? typeMap[type].cast(v, context, true)
                : acc
            : acc,
        null);
    return match == null
        ? v
        : match;
};

function Arg(arg, context) {
    const typePattern = new RegExp(`^(${types.join('|')}){(.*)}$`, 'i');
    const typeMatch = typePattern.exec(arg);

    if (typeMatch != null) {
        const [ type, raw ] = [ typeMatch[1].toLowerCase(), typeMatch[2] ];
        if (!types.includes(type)) throw new Error(`Invalid type for \`${type}\` in arg: ${arg}`);
        const argType = typeMap[type];
        if (type !== 'ref' && !argType.test(raw)) throw new Error(`invalid value \`${raw}\` for arg type \`${type}\` in arg: ${arg}`);
        const value = argType.cast(raw, context);
        return value;
    }

    const value = infer(arg, context);

    if (process.env.JOYCE_DEBUG) console.log(`Warning! No type was declared for arg \`${arg}\`. Resolving as \`${value}\``);

    return value;
}

function AstFromEL(str, context) {
    const parts = str.match(SPLIT);

    if (parts.length < 1) throw new Error(`invalid expression: ${str}`);

    if (parts.length === 1) return cast(Arg(parts[0], context));

    let i = 0;
    let compile;
    let args = [];
    while (i < parts.length) {
        if (whitespace.has(parts[i])) {
            i++;
            continue;
        }
        if (!compile && ops.has(parts[i])) {
            compile = Operation[parts[i++].toLowerCase()];
            continue;
        }
        args.push(Arg(parts[i++], context));
    }

    if (compile == null) throw new Error(`invalid op: ${op}`);

    return compile(...args);
}

function Value(value, context) {
    const hits = [];

    if (typeof value === 'string' && value.includes('{{')) {

        const pattern = EL();

        let hit;
        let lastIndex;
        let index;
        let length;

        while (hit = pattern.exec(value)) {
            const [ match, a, b, c ] = hit;
            const body = a || b || c;
            const pre = value.slice(lastIndex || 0, hit.index);
            lastIndex = pattern.lastIndex;
            index = hit.index;
            length = match.length;
            const ast = AstFromEL(body, context);
            const program = Program(ast);
            const code = astring.generate(program);
            const evaluated = evaluate(code, context);
            hits.push(pre ? `${pre}${evaluated}` : evaluated);
        }

        if (hits.length) {
            const last = hits.pop();
            const post = value.slice(length + index);
            hits.push(post ? `${last}${post}` : last);
            return hits.length > 1
                ? hits.join('')
                : hits[0];
        }
    }
    return value;
}
