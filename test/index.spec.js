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
            'strange))': "but true",
            a: '((== foo "bar"))',
            b: '((== a true))',
            c: '((=== foo "bar"))',
            d: '((!== foo "bar"))',
            e: '((NotEq foo "bar"))',
            f: '((!== foo "bar"))',
            g: '((GreaterThan baz 5))',
            h: '((> baz 5))',
            i: '((GreaterThanOrEqualTo baz 5))',
            j: '((LessThan baz 5))',
            k: '((LT baz 5))',
            l: '((LessThanOrEqualTo baz 5))',
            m: '((lte baz 5))',
            n: '((modulus baz 5))',
            o: '((mod baz 5))',
            p: '((add baz 5))',
            q: '((concat foo "-bar"))',
            r: '((- baz 5))',
            s: '((* baz 5))',
            t: '((/ baz 5))',
            u: '((filter gte bar 3))',
            v: '((filter gte bar 2))',
            w: '((join "-" bar))',
            x: '((join "~~~" xyzzy))',
            y: '((template "${0}, a \"note\" to follow ${1}" ref(foo) "foo"))',
            z: '((every op(lt) bar 6))',
            aa: '((Every gt bar 5))',
            bb: '((Some gte bar 5))',
            cc: '((Some gt bar 5))',
            dd: '((Find eq xyzzy "boom ! ! !"))',
            ee: '((Map concat xyzzy ".png"))',
            ff: '((Sum bar))',
            gg: '((Product bar))',
            hh: '((== oof "true"))',
            ii: '((join xyzzy))',
            jj: '((join "))" xyzzy))',
            kk: '((join "((foo))" xyzzy))',
            ll: '((join ref("strange))") xyzzy))'
            //mm: [ 'berry', 'pie' ],
            //nn: 'foo ((join " " mm))',
        })).to.eql({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            'strange))': "but true",
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
            hh: true,
            ii: 'sisboom ! ! !bah',
            jj: 'sis))boom ! ! !))bah',
            kk: 'sis((foo))boom ! ! !((foo))bah',
            ll: 'sisbut trueboom ! ! !but truebah'
            //mm: [ 'berry', 'pie' ],
            //nn: 'foo berry pie'
        });
    });
    it('and it works with strings...', () => {
        expect(Joyce('((== "foo" "foo"))')).to.eql(true);
        expect(Joyce('((== bam "boom"))', {
            bam: 'boom'
        })).to.eql(true);
    });
    it('and arrays... but again, why would anyone want this...', () => {
        expect(Joyce([
            'foo',
            '((== ref(0) "foo"))'
        ])).to.eql([ 'foo', true ]);
    });
    it('can filter things', () => {
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: '((filter == foo 1))'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: '((filter == [1,2,3,4] 1))'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: '((filter > [1,2,3,4] 1))'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: '((filter >= [1,2,3,4] 1))'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: '((filter lte [1,2,3,4] 2))'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: '((filter % [1,2,3,4] 2))'
        })).to.eql({
            bar: [ 1, 3 ]
        });
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: '((filter == foo 1))'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
    });
    it('can join things', () => {
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: '((join "-" foo))'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: '((join "-" foo))'
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
            bar: '((== sis.boom.bah[1] "bar"))'
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
            baz: '((== bar "a-b-c"))',
            bar: '((join "-" foo))'
        })).to.eql({
            foo: [ 'a', 'b', 'c' ],
            baz: true,
            bar: 'a-b-c'
        });
    });
    it('can render template strings...', () => {
        expect(Joyce({
            foo: 'bar',
            baz: '((template "foo-${0}-${2}-${1}" foo "qux" "baz"))'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
        expect(Joyce({
            foo: 'bar',
            baz: '((template "foo-${0}-${2}-${1}" ref(foo) string(qux) string(baz)))'
        })).to.eql({
            foo: 'bar',
            baz: 'foo-bar-baz-qux'
        });
    });
});
