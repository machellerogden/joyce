'use strict';

const chai = require('chai');
const { expect } = chai;

const Joyce = require('..');

describe('Joyce', () => {
    it('works', () => {
        expect(Joyce({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom", "bah" ],
            a: 'Fn::Equals(foo)::bar',
            b: 'Fn::Eq(a)::true',
            c: 'Fn::StrictEquals(foo)::bar',
            d: 'Fn::NotEquals(foo)::bar',
            e: 'Fn::NotEq(foo)::bar',
            f: 'Fn::StrictNotEquals(foo)::bar',
            g: 'Fn::GreaterThan(baz)::5',
            h: 'Fn::GT(baz)::5',
            i: 'Fn::GreaterThanOrEqualTo(baz)::5',
            j: 'Fn::LessThan(baz)::5',
            k: 'Fn::LT(baz)::5',
            l: 'Fn::LessThanOrEqualTo(baz)::5',
            m: 'Fn::LTE(baz)::5',
            n: 'Fn::Modulus(baz)::5',
            o: 'Fn::Mod(baz)::5',
            p: 'Fn::Add(baz)::5',
            q: 'Fn::Concat(foo)::-bar',
            r: 'Fn::Subtract(baz)::5',
            s: 'Fn::Multiply(baz)::5',
            t: 'Fn::Divide(baz)::5',
            u: 'Fn::Filter(bar)::gte::3',
            v: 'Fn::Filter(bar)::gte::2',
            w: 'Fn::Join(bar)::-',
            x: 'Fn::Join(xyzzy)::~~~',
            y: 'Fn::Template(${0}, a note to follow ${1})::Ref(foo)::foo',
            z: 'Fn::Every(bar)::lt::6',
            aa: 'Fn::Every(bar)::gt::5',
            bb: 'Fn::Some(bar)::gte::5',
            cc: 'Fn::Some(bar)::gt::5',
            dd: 'Fn::Find(xyzzy)::eq::boom',
            ee: 'Fn::Map(xyzzy)::concat::.png',
            //ff: 'Fn::Sum(bar)',
            //gg: 'Fn::Product(bar)',
            hh: 'Fn::Eq(oof)::"true"'
        })).to.eql({
            foo: 'bar',
            oof: 'true',
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
            //ff: 15,
            //gg: 120,
            hh: true
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
            bar: '@Equals/Ref(foo)/bar'
        }, { prefix: '@', delim: '/' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
    it('can filter things', () => {
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'Fn::Filter(foo)::Op(Equals)::1'
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
