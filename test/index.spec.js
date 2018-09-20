'use strict';

const chai = require('chai');
const { expect } = chai;

const Joyce = require('..');

describe('Joyce', () => {
    it('works', () => {
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom", "bah" ],
            a: 'Fn::Equals::Ref(foo)::String(bar)',
            b: 'Fn::Eq(a)::Boolean(true)',
            c: 'Fn::StrictEquals(foo)::String(bar)',
            d: 'Fn::NotEquals(foo)::String(bar)',
            e: 'Fn::NotEq(foo)::String(bar)',
            f: 'Fn::StrictNotEquals(foo)::String(bar)',
            g: 'Fn::GreaterThan::Ref(baz)::Number(5)',
            h: 'Fn::GT::Ref(baz)::Number(5)',
            i: 'Fn::GreaterThanOrEqualTo::Ref(baz)::Number(5)',
            j: 'Fn::LessThan::Ref(baz)::Number(5)',
            k: 'Fn::LT::Ref(baz)::Number(5)',
            l: 'Fn::LessThanOrEqualTo::Ref(baz)::Number(5)',
            m: 'Fn::LTE::Ref(baz)::Number(5)',
            n: 'Fn::Modulus::Ref(baz)::Number(5)',
            o: 'Fn::Mod::Ref(baz)::Number(5)',
            p: 'Fn::Add::Ref(baz)::Number(5)',
            q: 'Fn::Concat(foo)::String(-bar)',
            r: 'Fn::Subtract::Ref(baz)::Number(5)',
            s: 'Fn::Multiply::Ref(baz)::Number(5)',
            t: 'Fn::Divide::Ref(baz)::Number(5)',
            u: 'Fn::Filter::Ref(bar)::Op(gte)::Number(3)',
            v: 'Fn::Filter(bar)::Op(gte)::Number(2)',
            w: 'Fn::Join::Ref(bar)::String(-)',
            x: 'Fn::Join(xyzzy)::String(~~~)',
            y: 'Fn::Template(${0}, a note to follow ${1})::Ref(foo)::String(foo)',
            z: 'Fn::Every(bar)::Op(lt)::Number(6)',
            aa: 'Fn::Every(bar)::Op(gt)::Number(5)',
            bb: 'Fn::Some(bar)::Op(gte)::Number(5)',
            cc: 'Fn::Some(bar)::Op(gt)::Number(5)',
            dd: 'Fn::Find(xyzzy)::Op(eq)::String(boom)',
            ee: 'Fn::Map(xyzzy)::Op(concat)::String(.png)',
            ff: 'Fn::Sum(bar)',
            gg: 'Fn::Product(bar)'
        })).to.eql({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom", "bah" ],
            a: true,
            b: true,
            c: true,
            d: false,
            e: false,
            f: false,
            g: true,
            h: true,
            i: true,
            j: false,
            k: false,
            l: false,
            m: false,
            n: 0,
            o: 0,
            p: 105,
            q: 'bar-bar',
            r: 95,
            s: 500,
            t: 20,
            u: [ 3, 4, 5 ],
            v: [ 2, 3, 4, 5 ],
            w: '1-2-3-4-5',
            x: 'sis~~~boom~~~bah',
            y: 'bar, a note to follow foo',
            z: true,
            aa: false,
            bb: true,
            cc: false,
            dd: 'boom',
            ee: [ 'sis.png', 'boom.png', 'bah.png' ],
            ff: 15,
            gg: 120
        });
    });
    it('and it works with strings... although, beats me why you would want context-less evaluation like this.', () => {
        expect(Joyce('Fn::Equals::String(foo)::String(foo)')).to.eql(true);
    });
    it.skip('and arrays... but again, why would anyone want this...', () => {
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
            bar: 'Fn::Filter(foo)::Op(Equals)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Array([1,2,3,4])::Op(Eq)::Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Array([1,2,3,4])::Op(GT)::Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Array([1,2,3,4])::Op(GTE)::Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Array([1,2,3,4])::Op(lte)::Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: 'Fn::Filter::Array([1,2,3,4])::Op(mod)::Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter::Ref(foo)::Op(Equals)::Number(1)'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
    });
    it('can join things', () => {
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'Fn::Join(foo)::String(-)'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'Fn::Join(foo)::String(-)'
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
            bar: 'Fn::Join::Ref(foo)::String(-)'
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
