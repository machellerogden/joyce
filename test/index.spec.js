'use strict';

const chai = require('chai');
const { expect } = chai;

const Joyce = require('..');

describe('Joyce', () => {
    it('can compare values', () => {
        expect(Joyce({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: '((== foo "bar"))',
            b: '((== a true))',
            c: '((=== foo "bar"))',
            d: '((!== foo "bar"))',
            e: '((> baz 5))',
            f: '((>= baz 5))',
            g: '((< baz 5))',
            h: '((<= baz 5))'
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
            e: true,
            f: true,
            g: false,
            h: false
        });
    });
    it('can perform binary operations', () => {
        expect(Joyce({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            i: '((% baz 5))',
            j: '((+ baz 5))',
            k: '((+ foo "-bar"))',
            l: '((- baz 5))',
            m: '((* baz 5))',
            n: '((/ baz 5))'
        })).to.eql({
            foo: 'bar',
            oof: 'true',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            i: 0,
            j: 105,
            k: 'bar-bar',
            l: 95,
            m: 500,
            n: 20
        });
    });
    it('can filter', () => {
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
    it('can join', () => {
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
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            'strange))': "but true",
            cc: '((join xyzzy))',
            dd: '((join "))" xyzzy))',
            ee: '((join "((foo))" xyzzy))',
            ff: '((join ref("strange))") xyzzy))',
            gg: [ 'berry', 'pie' ],
            hh: 'foo ((join " " gg))'
        })).to.eql({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            'strange))': "but true",
            cc: 'sisboom ! ! !bah',
            dd: 'sis))boom ! ! !))bah',
            ee: 'sis((foo))boom ! ! !((foo))bah',
            ff: 'sisbut trueboom ! ! !but truebah',
            gg: [ 'berry', 'pie' ],
            hh: 'foo berry pie'
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
    it('can handle multiple expression in a single string (templating)', () => {
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
    it('can invoke other array operations', () => {
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            t: '((every < bar 6))',
            u: '((every > bar 5))',
            v: '((some >= bar 5))',
            w: '((some > bar 5))',
            x: '((find == xyzzy "boom ! ! !"))',
            y: '((map + xyzzy ".png"))',
            z: '((sum bar))',
            aa: '((product bar))',
        })).to.eql({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            t: true,
            u: false,
            v: true,
            w: false,
            x: 'boom ! ! !',
            y: [ 'sis.png', 'boom ! ! !.png', 'bah.png' ],
            z: 15,
            aa: 120
        });
    });
    it('can invoke Object functions', () => {
        expect(Joyce({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: '((keys foo))'
        })).to.eql({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: [ "bam", "qux" ]
        });
        expect(Joyce({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: '((values foo))'
        })).to.eql({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: [ "boom", "xyzzy" ]
        });
    });
    it('works with strings', () => {
        expect(Joyce('((== "foo" "foo"))')).to.eql(true);
        expect(Joyce('((== bam "boom"))', {
            bam: 'boom'
        })).to.eql(true);
    });
    it('works with arrays', () => {
        expect(Joyce([
            'foo',
            '((== ref(0) "foo"))'
        ])).to.eql([ 'foo', true ]);
    });
    it('can not be easily exploited', () => {
        expect(() => Joyce({
            foo: `((== ref(constructor.constructor("return process")().mainModule.require("console").log(constructor.constructor("return process")().mainModule.require("fs").statSync('.'))) "bar"))`
        })).to.throw('process is not defined');
    });
});
