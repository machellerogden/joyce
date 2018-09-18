'use strict';

const chai = require('chai');
const { expect } = chai;

const Joyce = require('..');

describe('Joyce', () => {
    it('works', () => {
        expect(Joyce({
            foo: 'bar',

            // long-form usage
            bar: 'Fn::Equals::Ref(foo)::String(bar)',

            // shorthand usage
            baz: 'Fn::Equals(bar)::Ref(foo)',

            qux: [ 1, 2, 3, 4 ],

            xyzzy: 'Fn::Filter::Op(gte)::Ref(qux)::Number(3)',

            // same example using shorthand... first argument is becomes cast by the stated operation.
            uuddlrlrba: 'Fn::Filter(gte)::Ref(qux)::Number(2)',

            bim: 'Fn::Join::String(-)::Ref(qux)',

            // shorthand again...
            bam: 'Fn::Join(***)::Ref(qux)',

            boom: 'Fn::Template(${0} is a ${1} name to use in an example)::Ref(foo)::String(terrible)'
        })).to.eql({
            foo: 'bar',
            bar: true,
            baz: true,
            qux: [ 1, 2, 3, 4 ],
            xyzzy: [ 3, 4 ],
            uuddlrlrba: [ 2, 3, 4 ],
            bim: '1-2-3-4',
            bam: '1***2***3***4',
            boom: 'bar is a terrible name to use in an example'
        });
    });
    it('and it works with strings... although, beats me why you would want context-less evaluation like this.', () => {
        expect(Joyce('Fn::Equals::String(foo)::String(foo)')).to.eql(true);
    });
    it('and arrays... but again, why would anyone want this...', () => {
        expect(Joyce([
            'foo',
            'Fn::Equals::Ref(0)::String(foo)'
        ])).to.eql([ 'foo', true ]);
    });
    it('has a customizable prefix and delimiter', () => {
        expect(Joyce({
            foo: 'bar',
            bar: 'Magic!!!Equals::Ref(foo)::String(bar)'
        }, { prefix: 'Magic!!!' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(Joyce({
            foo: 'bar',
            bar: '@Equals::Ref(foo)::String(bar)'
        }, { prefix: '@' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(Joyce({
            foo: 'bar',
            bar: '@Equals/Ref(foo)/String(bar)'
        }, { prefix: '@', delim: '/' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
    it('can filter things', () => {
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter(Equals)::Ref(foo)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter(Eq)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter(GT)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter(GTE)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter(LTE)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter(Mod)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter::Op(Equals)::Ref(foo)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Op(Eq)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Op(GT)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Op(GTE)::Array([1,2,3,4])::Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Op(LTE)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Op(Mod)::Array([1,2,3,4])::Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
    });
    it('can join things', () => {
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'Fn::Join::String(-)::Ref(foo)'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'Fn::Join(-)::Ref(foo)'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
    });
    it('can resolve deep values', () => {
        expect(Joyce({
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
        expect(Joyce({
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
        expect(Joyce({
            foo: 'bar',
            baz: 'Fn::Template(foo-${0}-${2}-${1})::Ref(foo)::String(qux)::String(baz)'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
        expect(Joyce({
            foo: 'bar',
            baz: 'Fn::Template::String(foo-${0}-${2}-${1})::Ref(foo)::String(qux)::String(baz)'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
    });
});
