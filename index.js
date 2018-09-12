'use strict';

module.exports = joyce;

const parse = require('./lib/parse');

function joyce(data, options = {}) {
    const { prefix = 'Fn::', delim = '::' } = options;
    return parse(data, prefix, delim);
}
