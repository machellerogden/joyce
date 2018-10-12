'use strict';

const vm = require('vm');

const evaluate = (statement, context) => {
    if (typeof context !== 'object') context = {};
    const sanitizeContext = 'Object.setPrototypeOf(context, Object.prototype);';
    return vm.runInNewContext(`${sanitizeContext}${statement}`, vm.createContext({ context }, { codeGeneration: { strings: false, wasm: false }}));
};

module.exports = evaluate;
