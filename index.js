'use strict';

module.exports = load;

const { VM } = require('vm2');
const acorn = require('acorn');
const astring = require('astring');
const fs = require('fs');
const path = require('path');
const callsites = require('callsites');
const YAML = require('js-yaml');
const { inspect } = require('util');
const globby = require('globby');
const m = require('module');
const untildify = require('untildify');

const evaluate = (statement, sandbox) => new VM({ sandbox }).run(statement);

const cast = (obj) => {
    if ('name' in obj) return {
        type: 'Identifier',
        name: obj.name
    }
    if ('value' in obj) return {
        type: 'Literal',
        value: obj.value
    }
};

const isObject = v => v != null && typeof v === 'object' && !Array.isArray(v);

function BinaryExpression(...args) {
    if (args.length !== 3) throw new Error('BinaryExpression requires exactly 3 arguments');
    const [ givenLeft, givenRight, operator = '==' ] = args;
    const left = cast(givenLeft);
    const right = cast(givenRight);
    const expression = {
        type: 'BinaryExpression',
        left,
        operator,
        right
    };
    const statement = {
        type: 'ExpressionStatement',
        expression
    };
    const ast = {
        type: 'Program',
        body: [ statement ]
    };
    return astring.generate(ast);
}

const statements = {
    BinaryExpression
};

function parse(given) {
    if (Array.isArray(given)) {
        return given.reduce((acc, value) => {
            if (isObject(value) && typeof value.type === 'string' && Array.isArray(value.statement)) return [ ...acc, evaluate(statements[value.type](...value.statement), acc) ];
            return [ ...acc, parse(value) ];
        }, []);
    }
    if (given != null && typeof given === 'object') {
        return Object.entries(given).reduce((acc, [ key, value ]) => {
            if (isObject(value) && typeof value.type === 'string' && Array.isArray(value.statement)) {
                acc[key] = evaluate(statements[value.type](...value.statement), acc);
            } else {
                acc[key] = parse(value);
            }
            return acc;
        }, {});
    }
    return given;
}

const yml = (filePath) => YAML.safeLoad(fs.readFileSync(filePath, 'utf8'));
const json = (filePath) => m._load(filePath);

const readers = {
    yml,
    yaml: yml,
    json
};

function load(givenPatterns, external = false) {
    const patterns = Array.isArray(givenPatterns)
        ? givenPatterns.map(p => untildify(p))
        : untildify(givenPatterns);
    const dir = external
        ? '/'
        : path.dirname(callsites()[1].getFileName());
    const paths = globby.sync(patterns, { cwd: dir });
    return paths.reduce((acc, file) => {
        const extIdx = file.lastIndexOf('.');
        const pdIdx = file.lastIndexOf(path.sep);
        const name = file.slice(pdIdx < 0 ? 0 : pdIdx + 1, extIdx);
        const ext = file.slice(extIdx + 1);
        const filePath = path.join(dir, file);
        if (Object.keys(readers).includes(ext)) acc[name] = parse(readers[ext](filePath));
        return acc;
    }, {});
}
