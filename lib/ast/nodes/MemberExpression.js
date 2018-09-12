'use strict';

module.exports = MemberExpression;

function MemberExpression(object, property, computed = false) {
    if (arguments.length <= 1) throw new Error('MemberExpression requires at least 2 arguments');

    const ast = {
        type: 'MemberExpression',
        object,
        property,
        computed
    };

    return ast;
}
