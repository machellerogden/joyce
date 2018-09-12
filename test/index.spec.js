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
    it('has a customizable prefix and delimiter', () => {
        expect(joyce({
            foo: 'bar',
            bar: 'Magic!!!Equals::Name(foo)::String(bar)'
        }, { prefix: 'Magic!!!' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(joyce({
            foo: 'bar',
            bar: '@Equals::Name(foo)::String(bar)'
        }, { prefix: '@' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(joyce({
            foo: 'bar',
            bar: '@Equals/Name(foo)/String(bar)'
        }, { prefix: '@', delim: '/' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
    it('can filter things', () => {
        expect(joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter::Op(==)::Name(foo)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Op(==)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Op(>)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Op(>=)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Op(<=)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Op(%)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
    });
});
