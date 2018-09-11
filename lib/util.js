'use strict';

exports.isObject = v => v != null && typeof v === 'object' && !Array.isArray(v);

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
