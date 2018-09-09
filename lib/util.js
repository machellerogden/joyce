'use strict';

const { EL_PREFIX } = require('./constants');

exports.isObject = v => v != null && typeof v === 'object' && !Array.isArray(v);

exports.isEL = (v) => (typeof v === 'string' && v.startsWith(EL_PREFIX));

exports.partial = (fn, ...partialArgs) => {
    const p = (...restArgs) => fn(...[ ...partialArgs, ...restArgs ]);
    const length = fn.length - partialArgs.length;
    Object.defineProperty(p, 'length', {
        value: length > 0
            ? length
            : 0
    });
    return p;
};
