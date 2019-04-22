'use strict';

const chai = require('chai');
const { expect } = chai;

const Joyce = require('..');

describe('Joyce', () => {
    it('can compare values', () => {
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: '{{=== str{123} "123"}}',
            b: '{{== a true}}',
            c: '{{=== foo "bar"}}',
            d: '{{!== foo "bar"}}',
            e: '{{> baz 5}}',
            f: '{{>= baz 5}}',
            g: '{{< baz 5}}',
            h: '{{<= baz 5}}'
        })).to.eql({
            foo: 'bar',
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
    it('operators can be anywhere as long as args are in correct order', () => {
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: '{{str{123} === "123"}}',
            b: '{{a == true}}',
            c: '{{foo === "bar"}}',
            d: '{{foo "bar" !== }}',
            e: '{{baz > 5}}',
            f: '{{baz >= 5}}',
            g: '{{baz < 5}}',
            h: '{{baz <= 5}}'
        })).to.eql({
            foo: 'bar',
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
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 101,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            i: '{{% baz 5}}',
            j: '{{+ baz 5}}',
            k: '{{+ foo "-bar"}}',
            l: '{{- baz 5}}',
            m: '{{* baz 5}}',
            n: '{{/ baz 5}}'
        })).to.eql({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 101,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            i: 1,
            j: 106,
            k: 'bar-bar',
            l: 96,
            m: 505,
            n: 20.2
        });
    });
    it('can express conditions', () => {
        expect(Joyce({
            foo: true,
            bar: '{{foo ? "foo is true" : "foo is false"}}'
        })).to.eql({
            foo: true,
            bar: "foo is true"
        });
        expect(Joyce({
            foo: false,
            bar: '{{foo ? "foo is true" "foo is false"}}'
        })).to.eql({
            foo: false,
            bar: "foo is false"
        });
        expect(Joyce({
            foo: "foo",
            bar: '{{foo ? eval{"{{foo}}/"} "/"}}'
        })).to.eql({
            foo: "foo",
            bar: "foo/"
        });
         expect(Joyce({
            foo: true,
            bar: '{{foo ? eval{"foo is {{boom}}"} : eval{"foo is {{splat}}"}}}',
            boom: 'bam',
            splat: 'squash'
        })).to.eql({
            foo: true,
            bar: "foo is bam",
            boom: 'bam',
            splat: 'squash'
        });
    });
    it('can nest expressions', () => {
        expect(Joyce({
            foo: true,
            bar: true,
            qux: '{{foo ? eval{"{{bar ? \"bar\" : \"foo\" }}"} : false}}'
        })).to.eql({
            foo: true,
            bar: true,
            qux: "bar"
        });
        expect(Joyce({
            foo: true,
            bar: false,
            qux: '{{foo ? eval{"{{bar ? \"bar\" : \"foo\" }}"} : false}}'
        })).to.eql({
            foo: true,
            bar: false,
            qux: "foo"
        });
    });
    it('can filter', () => {
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: '{{filter == foo 1}}'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: '{{filter == [1,2,3,4] 1}}'
        })).to.eql({
            bar: [ 1 ]
        });
        expect(Joyce({
            bar: '{{filter > [1,2,3,4] 1}}'
        })).to.eql({
            bar: [ 2, 3, 4 ]
        });
        expect(Joyce({
            bar: '{{filter >= [1,2,3,4] 1}}'
        })).to.eql({
            bar: [ 1, 2, 3, 4 ]
        });
        expect(Joyce({
            bar: '{{filter <= [1,2,3,4] 2}}'
        })).to.eql({
            bar: [ 1, 2 ]
        });
        expect(Joyce({
            bar: '{{filter % [1,2,3,4] 2}}'
        })).to.eql({
            bar: [ 1, 3 ]
        });
        expect(Joyce({
            foo: [ 1, 2, 3 ],
            bar: '{{filter == foo 1}}'
        })).to.eql({
            foo: [ 1, 2, 3 ],
            bar: [ 1 ]
        });
    });
    it('can join', () => {
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: '{{join "-" foo}}'
        })).to.eql({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: 'foo-bar-baz'
        });
        expect(Joyce({
            foo: [ 'foo', 'bar', 'baz' ],
            bar: '{{join "-" foo}}'
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
            cc: '{{join xyzzy}}',
            gg: [ 'berry', 'pie' ],
            hh: 'foo {{join " " gg}}'
        })).to.eql({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            cc: 'sisboom ! ! !bah',
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
            bar: '{{== sis.boom.bah[1] "bar"}}'
        })).to.eql({
            sis: {
                boom: {
                    bah: [ 'foo', 'bar', 'baz' ]
                }
            },
            bar: true
        });
        expect(Joyce({
            sis: {
                boom: {
                    bah: [ 'foo', 'bar', 'baz' ]
                }
            },
            bar: '{{sis.boom.bah[1]}}'
        })).to.eql({
            sis: {
                boom: {
                    bah: [ 'foo', 'bar', 'baz' ]
                }
            },
            bar: 'bar'
        });
    });
    it('can handle recursive evaluations in any order', () => {
        expect(Joyce({
            foo: [ 'a', 'b', 'c' ],
            baz: '{{== bar "a-b-c"}}',
            bar: '{{join "-" foo}}'
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
            inhuman: '{{quake}} {also know as {{daisy}}} is an inhuman'
        })).to.eql({
            quake: 'daisy',
            daisy: 'sky',
            inhuman: 'daisy {also know as sky} is an inhuman'
        });
        expect(Joyce({
            quake: 'daisy',
            daisy: 'sky',
            species: 'inhuman',
            inhuman: '{{quake}} {also know as {{"dai}}sy"}}} is an {{species}}'
        })).to.eql({
            quake: 'daisy',
            daisy: 'sky',
            species: 'inhuman',
            inhuman: 'daisy {also know as dai}}sy} is an inhuman'
        });
    });
    it('can invoke other array operations', () => {
        expect(Joyce({
            foo: 'bar',
            bar: [ 1, 2, 3, 4, 5 ],
            baz: 100,
            qux: { "yes" : "no" },
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            t: '{{every < bar 6}}',
            u: '{{every > bar 5}}',
            v: '{{some >= bar 5}}',
            w: '{{some > bar 5}}',
            x: '{{find == xyzzy "boom ! ! !"}}',
            y: '{{map + xyzzy ".png"}}',
            z: '{{sum bar}}',
            aa: '{{product bar}}',
            bb: '{{find > bar 3}}'
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
            aa: 120,
            bb: 4
        });
    });
    it('can invoke Object functions', () => {
        expect(Joyce({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: '{{keys foo}}'
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
            bar: '{{values foo}}'
        })).to.eql({
            foo: {
                bam: "boom",
                qux: "xyzzy"
            },
            bar: [ "boom", "xyzzy" ]
        });
    });
    it('works with strings', () => {
        expect(Joyce('{{== "foo" "foo"}}')).to.eql(true);
        expect(Joyce('{{== bam "boom"}}', {
            bam: 'boom'
        })).to.eql(true);
    });
    it('works with arrays', () => {
        expect(Joyce([
            'foo',
            '{{== ref{0} "foo"}}'
        ])).to.eql([ 'foo', true ]);
    });
    it('balancing acts', () => {
        expect(Joyce({
            foo: 'bar',
            'strange}}': "but true",
            '"stranger}}"': "and also true",
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: '{{join ref{"strange}}"} xyzzy}}',
            b: '{{join ref{"strange}}"} xyzzy}}',
            c: '{{join "}}" xyzzy}}',
            d: '{{join "{{foo}}" xyzzy}}',
            e: '{{ref{foo}}}',
            f: '{{"foo"}}',
            g: '{{str{foo}}}',
            h: '{{str{"foo"}}}',
            i: '{{""foo""}}',
            j: '{{\'\'foo\'\'}}',
            k: "{{''foo''}}",
            l: "{{''fo}}o''}}",
            m: "{{'fo{{o'}}",
            n: '{{join ref{\'"stranger}}"\'} xyzzy}}'
        })).to.eql({
            foo: 'bar',
            'strange}}': "but true",
            '"stranger}}"': "and also true",
            xyzzy: [ "sis", "boom ! ! !", "bah" ],
            a: 'sisbut trueboom ! ! !but truebah',
            b: 'sisbut trueboom ! ! !but truebah',
            c: 'sis}}boom ! ! !}}bah',
            d: 'sis{{foo}}boom ! ! !{{foo}}bah',
            e: 'bar',
            f: 'foo',
            g: 'foo',
            h: '"foo"',
            i: '"foo"',
            j: "'foo'",
            k: "'foo'",
            l: "'fo}}o'",
            m: "fo{{o",
            n: 'sisand also trueboom ! ! !and also truebah'
        });
    });
    it('can not be easily exploited', () => {
        // the following exploit works in a vanilla vm configuration but Joyce has multiple defenses against attacks such as this...
        expect(() => Joyce({
            foo: `{{== ref{constructor.constructor("return process")().mainModule.require("console").log(constructor.constructor("return process")().mainModule.require("fs").statSync('.'))} "bar"}}`
        })).to.throw('Code generation from strings disallowed for this context');
    });
});
