'use strict';

const chai = require('chai');
const { expect } = chai;

const joyce = require('..');

describe('joyce', () => {
    it('works', () => {
        expect(joyce({
            foo: 'bar',
            bar: 'Fn::Equals::Ref(foo)::String(bar)',
            baz: {
                qux: [
                    'Fn::Equals::Ref(foo)::String(bar)'
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
            bar: 'Magic!!!Equals::Ref(foo)::String(bar)'
        }, { prefix: 'Magic!!!' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(joyce({
            foo: 'bar',
            bar: '@Equals::Ref(foo)::String(bar)'
        }, { prefix: '@' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(joyce({
            foo: 'bar',
            bar: '@Equals/Ref(foo)/String(bar)'
        }, { prefix: '@', delim: '/' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
    it('can filter things', () => {
        expect(joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter::Equals::Ref(foo)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Eq::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::GT::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::GTE::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::LTE::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(joyce({
            bar: 'Fn::Filter::Mod::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
    });
    it('can join things', () => {
        expect(joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'Fn::Join::String(-)::Ref(foo)'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
    });
    it('can resolve deep values', () => {
        expect(joyce({
            sis: {
                boom: {
                    bah: [ 'foo', 'bar', 'baz' ]
                }
            },
            bar: 'Fn::Equals::Ref(sis.boom.bah[1])::String(bar)'
        })).to.eql({
            sis: {
                boom: {
                    bah: [ 'foo', 'bar', 'baz' ]
                }
            },
            bar: true
        });
    });
    it('can handle recursive evaluations in any order', () => {
        expect(joyce({
            foo: [ 'a', 'b', 'c' ],
            baz: 'Fn::Equals::Ref(bar)::String(a-b-c)',
            bar: 'Fn::Join::String(-)::Ref(foo)'
        })).to.eql({
            foo: [ 'a', 'b', 'c' ],
            baz: true,
            bar: 'a-b-c'
        });
    });
    it('can do template strings... in it\'s own special way', () => {
        expect(joyce({
            foo: 'bar',
            baz: 'Fn::Template(foo-${0}-${2}-${1})::Ref(foo)::String(qux)::String(baz)'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
    });
});
