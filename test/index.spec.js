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
            e: '((> baz 5))',
            f: '((>= baz 5))',
            g: '((< baz 5))',
            h: '((<= baz 5))',
            i: '((% baz 5))',
            j: '((+ baz 5))',
            k: '((+ foo "-bar"))',
            l: '((- baz 5))',
            m: '((* baz 5))',
            n: '((/ baz 5))',
            o: '((filter >= bar 3))',
            p: '((filter >= bar 2))',
            q: '((join "-" bar))',
            r: '((join "~~~" xyzzy))',
            s: '((foo)), a "note" to follow (("foo"))',
            t: '((every < bar 6))',
            u: '((Every > bar 5))',
            v: '((Some >= bar 5))',
            w: '((Some > bar 5))',
            x: '((Find == xyzzy "boom ! ! !"))',
            y: '((Map + xyzzy ".png"))',
            z: '((Sum bar))',
            aa: '((Product bar))',
            bb: '((== oof "true"))',
            cc: '((join xyzzy))',
            dd: '((join "))" xyzzy))',
            ee: '((join "((foo))" xyzzy))',
            ff: '((join ref("strange))") xyzzy))',
            gg: [ 'berry', 'pie' ],
            hh: 'foo ((join " " gg))',
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
            e: true,
            f: true,
            g: false,
            h: false,
            i: 0,
            j: 105,
            k: 'bar-bar',
            l: 95,
            m: 500,
            n: 20,
            o: [ 3, 4, 5 ],
            p: [ 2, 3, 4, 5 ],
            q: '1-2-3-4-5',
            r: 'sis~~~boom ! ! !~~~bah',
            s: 'bar, a "note" to follow foo',
            t: true,
            u: false,
            v: true,
            w: false,
            x: 'boom ! ! !',
            y: [ 'sis.png', 'boom ! ! !.png', 'bah.png' ],
            z: 15,
            aa: 120,
            bb: true,
            cc: 'sisboom ! ! !bah',
            dd: 'sis))boom ! ! !))bah',
            ee: 'sis((foo))boom ! ! !((foo))bah',
            ff: 'sisbut trueboom ! ! !but truebah',
            gg: [ 'berry', 'pie' ],
            hh: 'foo berry pie'
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
            bar: '((filter <= [1,2,3,4] 2))'
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
    it('can handle multiple expression in a single string', () => {
        expect(Joyce({
            quake: 'daisy',
            daisy: 'sky',
            inhuman: '((quake)) (also know as ((daisy))) is an inhuman'
        })).to.eql({
            quake: 'daisy',
            daisy: 'sky',
            inhuman: 'daisy (also know as sky) is an inhuman'
        });
        expect(Joyce({
            quake: 'daisy',
            daisy: 'sky',
            species: 'inhuman',
            inhuman: '((quake)) (also know as (("dai))sy"))) is an ((species))'
        })).to.eql({
            quake: 'daisy',
            daisy: 'sky',
            species: 'inhuman',
            inhuman: 'daisy (also know as dai))sy) is an inhuman'
        });
    });
});
