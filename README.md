# Joyce

> An AST-based Expression Language

[![Version](https://img.shields.io/npm/v/joyce.svg)]() [![Travis](https://img.shields.io/travis/machellerogden/joyce.svg)]() [![License](https://img.shields.io/npm/l/joyce.svg)]()

## Installation

```sh
npm i joyce
```

## Usage

Joyce accepts any type of value. If that value happens to be or happens to contain a string which starts with a special prefix, then that string value will be parsed and evaluated within the context of the originally given value.

### A Basic Example

```js
const Joyce = require('joyce');

Joyce({
    hello: 'world',
    isWorld: 'Fn::Equals::Ref(hello)::String(world)'
});

// returns...
{
    hello: 'world',
    isWorld: true
}
```

### A Shorthand Example

> Joyce is optimized for usablity. Here's the same examples from above but this time using a shorthand syntax.

```js
const Joyce = require('joyce');

Joyce({
    hello: 'world',
    isWorld: 'Fn::Equals(hello)::String(world)'
});

// returns...
{
    hello: 'world',
    isWorld: true
}
```

### Kitchen Sink Example

>

```js
const Joyce = require('joyce');

Joyce({
    foo: 'bar',

    bar: 'Fn::Equals::Ref(foo)::String(bar)',

    // when using shorthand... first argument becomes part of operation.
    baz: 'Fn::Equals(bar)::Ref(foo)',

    qux: [ 1, 2, 3, 4 ],

    xyzzy: 'Fn::Filter::Op(gte)::Ref(qux)::Number(3)',

// and the shorthand...
    uuddlrlrba: 'Fn::Filter(gte)::Ref(qux)::Number(2)',

    bim: 'Fn::Join::String(-)::Ref(qux)',

    // shorthand again...
    bam: 'Fn::Join(***)::Ref(qux)',

    boom: 'Fn::Template(${0} is a ${1} name to use in an example)::Ref(foo)::String(terrible)'
});

// returns...
{
    foo: 'bar',
    bar: true,
    baz: true,
    qux: [ 1, 2, 3, 4 ],
    xyzzy: [ 3, 4 ],
    uuddlrlrba: [ 2, 3, 4 ],
    bim: '1-2-3-4',
    bam: '1***2***3***4',
    boom: 'bar is a terrible name to use in an example'
}
```
