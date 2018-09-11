'use strict';

/**
 * this is what we're shooting for...
 */

{
    type: 'ObjectExpression',
        properties: [
            {
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'foo'
                },
                value: {
                    type: 'Literal',
                    value: 'bar'
                },
                kind: 'init'
            }
        ]
}
