'use strict';

const chai = require('chai');
const { expect } = chai;

const joyce = require('..');

describe('joyce', () => {
    it('works', () => {
        expect(joyce({
            foo: 'bar',
            bar: 'Fn::Equals::Name(foo)::String(bar)',
            baz: {
                qux: [
                    'Fn::Equals::Name(foo)::String(bar)'
                ]
            }
        })).to.eql({
            foo: 'bar',
            bar: true,
            baz: { qux: [ true ] }
        });
    });
    it('has a customizable prefix', () => {
        expect(joyce({
            foo: 'bar',
            bar: 'Magic::Equals::Name(foo)::String(bar)'
        }, { prefix: 'Magic' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
});
