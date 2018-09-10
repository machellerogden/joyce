'use strict';

module.exports = load;

const parse = require('./lib/parse');
const Globble = require('globble');

function load(givenPatterns, searchFromRoot = false) {
    return Globble(givenPatterns, searchFromRoot).map(({ data, ...rest }) => ({
        ...rest,
        data: parse(data)
    }));
}
