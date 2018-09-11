'use strict';

module.exports = Literal;

function Literal(v) {
    return {
        type: 'Literal',
        value: v
    };
}
