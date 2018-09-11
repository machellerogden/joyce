'use strict';

module.exports = Identifier;

function Identifier(v) {
    return {
        type: 'Identifier',
        name: v
    };
}
