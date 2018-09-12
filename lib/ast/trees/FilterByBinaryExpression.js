'use strict';

const castValue = require('../castValue');
const { compose } = require('needful');
const {
    ExpressionStatement,
    CallExpression,
    MemberExpression,
    ArrayExpression,
    Identifier,
    ArrowFunctionExpression,
    BinaryExpression
} = require('require-dir')('../nodes');

module.exports = (operator, arr, testValue) => compose(
        ExpressionStatement,
        CallExpression)(
            MemberExpression(
                castValue(arr), Identifier('filter')),
                [ ArrowFunctionExpression(
                    BinaryExpression(operator, Identifier('v'), testValue),
                    [ Identifier('v') ]) ]);
//{
    //type: 'Program',
        //body:
    //[ {
        //type: 'ExpressionStatement',
        //expression:
        //{
            //type: 'CallExpression',
            //callee:
            //{
                //type: 'MemberExpression',
                //object:
                //{
                    //type: 'ArrayExpression',
                    //elements:
                    //[ { type: 'Literal', value: 1 },
                        //{ type: 'Literal', value: 2 },
                        //{ type: 'Literal', value: 3 } ] },
                //property:
                //{ type: 'Identifier', name: 'filter' },
                //computed: false },
            //arguments:
            //[ {
                //type: 'ArrowFunctionExpression',
                //id: null,
                //generator: false,
                //expression: true,
                //params:
                //[ { type: 'Identifier', name: 'v' } ],
                //body:
                //{
                    //type: 'BinaryExpression',
                    //left: { type: 'Identifier', name: 'v' },
                    //operator: '%',
                    //right:
                    //{ type: 'Literal', value: 2 } } } ] } } ],
        //sourceType: 'script' }
