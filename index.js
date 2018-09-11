'use strict';

module.exports = joyce;

const parse = require('./lib/parse');

function joyce(data, options = {}) {
    const { prefix = 'Fn' } = options;
    return parse(data, prefix);
}
