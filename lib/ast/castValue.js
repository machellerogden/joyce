'use strict';

module.exports = castValue;

const nodes = require('require-dir')('./nodes');

const {
    Property,
    Literal,
    Identifier,
    ObjectExpression,
    ArrayExpression
} = nodes;

function castValue(given) {

    function cast(value) {
        if ([ 'string', 'boolean', 'number' ].includes(typeof value) || value === null) {
            return Literal(value);
        }

        if (typeof value === 'undefined') {
            return Identifier('undefined');
        }

        if (Array.isArray(value)) {
            return ArrayExpression(value.map(cast));
        }

        if (typeof value === 'object') {
            if (value.type && Object.keys(nodes).includes(value.type)) return value;
            return ObjectExpression(Object.entries(value).map(([ k, v ]) => Property(k, cast(v))));
        }
    }

    return cast(given);
}
