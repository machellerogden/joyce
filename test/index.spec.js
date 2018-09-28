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
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: 'eval == foo "bar"',
            b: 'eval == a true',
            c: 'eval === foo "bar"',
            d: 'eval !== foo "bar"',
            e: 'eval NotEq foo "bar"',
            f: 'eval !== foo "bar"',
            g: 'eval GreaterThan baz 5',
            h: 'eval > baz 5',
            i: 'eval GreaterThanOrEqualTo baz 5',
            j: 'eval LessThan baz 5',
            k: 'eval LT baz 5',
            l: 'eval LessThanOrEqualTo baz 5',
            m: 'eval lte baz 5',
            n: 'eval modulus baz 5',
            o: 'eval mod baz 5',
            p: 'eval add baz 5',
            q: 'eval concat foo "-bar"',
            r: 'eval - baz 5',
            s: 'eval * baz 5',
            t: 'eval / baz 5',
            u: 'eval filter bar gte 3',
            v: 'eval filter bar gte 2',
            w: 'eval join bar "-"',
            x: 'eval join xyzzy "~~~"',
            y: 'eval template "${0}, a \"note\" to follow ${1}" Ref(foo) "foo"',
            z: 'eval every bar Op(lt) 6',
            aa: 'eval Every bar gt 5',
            bb: 'eval Some bar gte 5',
            cc: 'eval Some bar gt 5',
            dd: 'eval Find xyzzy eq "boom ! ! !"',
            ee: 'eval Map xyzzy concat ".png"',
            ff: 'eval Sum bar',
            gg: 'eval Product bar',
            hh: 'eval == oof "true"'
        })).to.eql({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
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
            x: 'sis~~~boom ! ! !~~~bah',
            y: 'bar, a "note" to follow foo',
            z: true,
            aa: false,
            bb: true,
            cc: false,
            dd: 'boom ! ! !',
            ee: [ 'sis.png', 'boom ! ! !.png', 'bah.png' ],
            ff: 15,
            gg: 120,
            hh: true
        });
    });
    it('and it works with strings...', () => {
        expect(Joyce('eval == String(foo) String(foo)')).to.eql(true);
        expect(Joyce('eval == bam "boom"', {
            bam: 'boom'
        })).to.eql(true);
    });
    it('and arrays... but again, why would anyone want this...', () => {
        expect(Joyce([
            'foo',
            'eval == Ref(0) String(foo)'
        ])).to.eql([ 'foo', true ]);
    });
    it('has a customizable prefix', () => {
        expect(Joyce({
            foo: 'bar',
            bar: 'Magic!! == Ref(foo) String(bar)'
        }, { prefix: 'Magic!!' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(Joyce({
            foo: 'bar',
            bar: '@ == Ref(foo) String(bar)'
        }, { prefix: '@ ' })).to.eql({
            foo: 'bar',
            bar: true
        });
        expect(Joyce({
            foo: 'bar',
            bar: '@ == foo "bar"'
        }, { prefix: '@' })).to.eql({
            foo: 'bar',
            bar: true
        });
    });
    it('can filter things', () => {
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'eval filter foo Op(==) 1'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'eval filter [1,2,3,4] Op(==) Number(1)'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: 'eval filter [1,2,3,4] Op(GT) Number(1)'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'eval filter [1,2,3,4] Op(GTE) Number(1)'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: 'eval filter [1,2,3,4] Op(lte) Number(2)'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: 'eval filter [1,2,3,4] Op(mod) Number(2)'
        })).to.eql({
            bar: [ 1, 3 ]
        });
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: 'eval filter foo Op(==) 1'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
    });
    it('can join things', () => {
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'eval join foo String(-)'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'eval join foo String(-)'
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
            bar: 'eval == Ref(sis.boom.bah[1]) String(bar)'
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
            baz: 'eval == Ref(bar) String(a-b-c)',
            bar: 'eval join Ref(foo) String(-)'
        })).to.eql({
            foo: [ 'a', 'b', 'c' ],
            baz: true,
            bar: 'a-b-c'
        });
    });
    it('can do template strings... in it\'s own special way', () => {
        expect(Joyce({
            foo: 'bar',
            baz: 'eval template "foo-${0}-${2}-${1}" Ref(foo) String(qux) String(baz)'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
        expect(Joyce({
            foo: 'bar',
            baz: 'eval template "foo-${0}-${2}-${1}" Ref(foo) String(qux) String(baz)'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
    });
});
