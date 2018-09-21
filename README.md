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
    isWorld: 'Fn::Eq(hello)::world'
});

// returns...
{
    hello: 'world',
    isWorld: true
}
```

### A Long Form Example

Mostly you can count on the fact that the type for a given value will be
properly inferred but there are cases in which you will need to do some explicit
casting.

Here's the same example again using the long-form operator and with all values explicitly cast to their corresponding types.

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

### More Examples

> Refer to [unit tests](test/index.spec.js) for many many more examples.

```js
const Joyce = require('joyce');

Joyce({
    foo: [ 1, 2, 3, 4 ],
    bar: 'Fn::Filter(foo)::GTE::3',
    baz: 'Fn::Join(foo)::-',
    qux: 'Fn::Template(${0}, a note to follow ${1})::Ref(foo)::foo'
});

// returns...
{
    foo: [ 1, 2, 3, 4 ],
    bar: [ 3, 4 ],
    baz: '1-2-3-4',
    qux: 'bar, a note to follow foo'
}
```

### Command-Line Usage

```sh
echo '{"foo":"bar","Fn::Eq(foo)::bar"}' | joyce
```

### License

MIT
