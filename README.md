# Joyce

> An AST-based Expression Language

[![Version](https://img.shields.io/npm/v/joyce.svg)]() [![Travis](https://img.shields.io/travis/machellerogden/joyce.svg)]() [![License](https://img.shields.io/npm/l/joyce.svg)]()

## Installation

### Local Installation

```sh
npm i joyce
```

### Global Installation

> Use the global install if you want to use the `joyce` command-line tool.

```sh
npm i -g joyce
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

### More Examples

> Refer to unit tests for even more examples.

```js
const Joyce = require('joyce');

Joyce({
    foo: 'bar',

    bar: 'Fn::Equals::Ref(foo)::String(bar)',

    // when using shorthand... first argument becomes part of operation.
    baz: 'Fn::Equals(foo)::String(bar)',

    qux: [ 1, 2, 3, 4 ],

    xyzzy: 'Fn::Filter(qux)::Op(gte)::Number(3)',

    bim: 'Fn::Join(qux)::String(-)',

    // shorthand again...
    bam: 'Fn::Join(qux)::String(***)',

    boom: 'Fn::Template(${0}, a note to follow ${1})::Ref(foo)::String(foo)'
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
    boom: 'bar, a note to follow foo'
}
```

### Command-Line Usage

```sh
echo '{"foo":"bar","Fn::Equals(foo)::String(bar)"}' | joyce
```

### License

MIT
