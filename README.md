# Joyce

> An AST-based Expression Language

[![Version](https://img.shields.io/npm/v/joyce.svg)]() [![Travis](https://img.shields.io/travis/machellerogden/joyce.svg)]() [![License](https://img.shields.io/npm/l/joyce.svg)]()

Joyce is a powerful expression language for dynamically data processing. It's particularly useful for processing configuration data.

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

Joyce accepts any type of value. If that value happens to have contain the pattern `((.+))` then the inner form of that pattern will be parsed and evaluated within the context of the originally given value.

### A Basic Example

```js
const Joyce = require('joyce');

Joyce({
    hello: 'world',
    isWorld: '((== hello "world"))'
});

// {
//     hello: 'world',
//     isWorld: true
// }
```

### More Examples

> Refer to [unit tests](test/index.spec.js) for many many more examples.

```js
const Joyce = require('joyce');

Joyce({
    foo: [ 1, 2, 3, 4 ],
    bar: '((filter >= foo 3))',
    baz: '((join "-" foo))',
    qux: '((foo)), a "note" to follow (("foo"))'
});

// {
//     foo: [ 1, 2, 3, 4 ],
//     bar: [ 3, 4 ],
//     baz: '1-2-3-4',
//     qux: 'bar, a note to follow foo'
// }
```

### Command-Line Usage

```sh
echo '{"foo":"bar","bar":"((== foo \"bar\"))"}' | joyce

# {
#     "foo": "bar",
#     "bar": true
# }
```

## API

### Expressions

All expressions are strings and take the following form.

```
((operation ...args))
```

Expression can be used at any position within a string.

```
plain text ((operation ...args)) plain text
```

Multiple expressions can be used in a single string, but expressions cannot be nested.

```
plain text ((operation ...args)) plain text ((operation ...args)) plain text
```

Operation names are case insensitive.

```
((OPERATION ...args))
```

Operations with operator arguments use [polish notation](https://en.wikipedia.org/wiki/Polish_notation).

```
((OPERATION operator ...args))
```

### Operations

The following operators are supported.

#### ==

Loose equality

```js
Joyce({
    foo: 123,
    bar: '((== foo "123"))'
});

// {
//   foo: 123,
//   bar: true
// }
```

#### ===

Strict equality

```js
Joyce({
    foo: 123,
    bar: '((=== foo "123"))'
});

// {
//   foo: 123,
//   bar: false
// }
```

#### !=

Loose inequality

```js
Joyce({
    foo: 123,
    bar: '((!= foo "123"))'
});

// {
//   foo: 123,
//   bar: false
// }
```

#### !==

Strict inequality

```js
Joyce({
    foo: 123,
    bar: '((!== foo "123"))'
});

// {
//   foo: 123,
//   bar: true
// }
```

#### >

Greater than

```js
Joyce({
    foo: 2,
    bar: '((> foo 2))'
});

// {
//   foo: 2,
//   bar: false
// }
```

#### >=

Greater than or equal to

```js
Joyce({
    foo: 2,
    bar: '((>= foo 2))'
});

// {
//   foo: 2,
//   bar: true
// }
```

#### <

Less than.

```js
Joyce({
    foo: 2,
    bar: '((< foo 2))'
});

// {
//   foo: 2,
//   bar: false
// }
```

#### <=

Less than or equal to

```js
Joyce({
    foo: 2,
    bar: '((<= foo 2))'
});

// {
//   foo: 2,
//   bar: true
// }
```

#### %

Modulus

```js
Joyce({
    foo: 101,
    bar: '((% foo 5))'
});

// {
//   foo: 100,
//   bar: 1
// }
```

#### +

Add

```js
Joyce({
    foo: 1,
    bar: '((+ foo 1))'
});

// {
//   foo: 1,
//   bar: 2
// }
```

Concat

```js
Joyce({
    foo: 'a',
    bar: '((+ foo "b"))'
});

// {
//   foo: 'a',
//   bar: 'ab'
// }
```

#### -

Subtract

```js
Joyce({
    foo: 1,
    bar: '((- foo 1))'
});

// {
//   foo: 1,
//   bar: 0
// }
```

#### *

Multiply

```js
Joyce({
    foo: 100,
    bar: '((* foo 5))'
});

// {
//   foo: 100,
//   bar: 500
// }
```

#### /

Divide

```js
Joyce({
    foo: 100,
    bar: '((/ foo 5))'
});

// {
//   foo: 100,
//   bar: 20
// }
```

#### filter

Filter an array.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((filter % foo 2))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: [ 1, 3, 5 ]
// }
```

```js
Joyce({
    foo: [ 1, 2, 3, 4 ],
    bar: '((filter <= foo 2))'
});

// {
//   foo: [ 1, 2, 3, 4 ],
//   bar: [ 1, 2 ]
// }
```

#### join

Join an array

```js
Joyce({
    foo: [ "a", "b", "c" ],
    bar: '((join "-" foo))'
});

// {
//   foo: [ "a", "b", "c" ],
//   bar: "a-b-c"
// }
```

When only one arg is given, array elements will be join by an empty string.

```js
Joyce({
    foo: [ "a", "b", "c" ],
    bar: '((join foo))'
});

// {
//   foo: [ "a", "b", "c" ],
//   bar: "abc"
// }
```

#### every

Returns true if every element in the given array match the given predicate, otherwise returns false.

Call signature is `((every operator array comparison-value))`.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((every < foo 6))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: true
// }
```

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((every > foo 4))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: false
// }
```

#### some

Returns true if some of the elements in the given array match the given predicate, otherwise returns false.

Call signature is `((some operator array comparison-value))`.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((some > foo 4))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: true
// }
```

#### find

Returns first element in a given array which matches a given predicate.

Call signature is `((find operator array comparison-value))`.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((find > foo 3))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: 4
// }
```

#### map

Performs a binary operation on each element in a given array and return a new array.

Call signature is `((map operator array subject-value))`.

```js
Joyce({
    foo: [ "file1", "file2", "file3" ],
    bar: '((map + foo ".png"))'
});

// {
//   foo: [ "file1", "file2", "file3" ],
//   bar: [ "file1.png", "file2.png", "file3.png" ]
// }
```

#### sum

(aliased as `concat`)

Adds or concats the elements of a given array.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((sum foo))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: 15
// }
```

```js
Joyce({
    foo: [ "a", "b", "c" ],
    bar: '((sum foo))'
});

// {
//   foo: [ "a", "b", "c" ],
//   bar: "abc"
// }
```

#### concat

(alias for `sum`)

#### product

Multiply the elements of a given array.

```js
Joyce({
    foo: [ 1, 2, 3, 4, 5 ],
    bar: '((product foo))'
});

// {
//   foo: [ 1, 2, 3, 4, 5 ],
//   bar: 96
// }
```

#### keys

Returns an array containing a given object's keys.

```js
Joyce({
    foo: {
        baz: "bim",
        bam: "boom"
    },
    bar: '((keys foo))'
});

// {
//   foo: {
//     baz: "bim",
//     bam: "boom"
//   },
//   bar: [ "baz", "bam" ]
// }
```

#### values

Returns an array containing a given object's values.

```js
Joyce({
    foo: {
        baz: "bim",
        bam: "boom"
    },
    bar: '((keys foo))'
});

// {
//   foo: {
//     baz: "bim",
//     bam: "boom"
//   },
//   bar: [ "bim", "boom" ]
// }
```

### Operators

For operations which accept operator arugments, the follower operators are defined.

```
===
==
>
>
<
<
>=
<=
%
+
+
-
*
/
```

## Explict Type Casting

There are times when you will want to explicitly cast as arguments as a certain type.

For instance, consider the following.

```js
Joyce({
    "==": "foo",
    bar: '((== == "foo"))'
});

// {
//   foo: "==",
//   bar: false
// }
```

Bar should be true, but Joyce has cast the `==` as an operation instead of a reference.

This is easily fixed.

```js
Joyce({
    "==": "foo",
    bar: '((== ref("==") "foo"))'
});

// {
//   foo: "==",
//   bar: true
// }
```

Note that we not only wrap the `==` argument in `ref()` but we also quote it. Anything in which you would have to use array-notation in JavaScript when referencing a property must be quoted.

All argument types can be explictly cast if you find that the need arises.

The casting notation is always: `type(value)`

The following types are supported:

* `ref`
* `str`
* `num`
* `obj`
* `arr`
* `bool`

## Deep Property Resolution

You can evaluate deeply nested values in Joyce by referencing a keypath.

```
Joyce({
    sis: {
        boom: {
            bah: [ 'foo', 'bar', 'baz' ]
        }
    },
    bar: '((== sis.boom.bah[1] "bar"))'
});

// {
//   sis: {
//     boom: {
//       bah: [ 'foo', 'bar', 'baz' ]
//     }
//   },
//   bar: true
// }

```

## Why an AST-based EL?

Security matters.

Most ELs are open to security vulnerabilities because they depend on dynamic code evaluation. Like any EL, Joyce also depends on dynamic code evaluation, but what differentiates Joyce from most other ELs is that it does very little direct evaluation of user input. Almost all user input in parsed into tightly restricted AST forms. Joyce uses `astring` to emit code from the resulting AST and it is only these curated code strings which are evaluated.

This mediation via AST provides a level of control and sanitization that makes Joyce one of the safest ELs out there.

In the interest of full transparency, there is one code path in Joyce which will result in direct evaluation of unsanitized user input: deep property evaluation (i.e. `((foo.bar.baz))`). Measures have been taken to ensure that this code path is not exploitable. See [unit tests](test/index.spec.js) for coverage of this possible attack vector.

## Using Joyce with Config Files

You have options...

```js
'use strict';
const globble = require('globble');
const Joyce = require('Joyce');

(async () => {
    const data = await globble('./config/**', { cwd: __dirname, clobber: true });
    console.log(Joyce(data));
})();
```

Or...

```sh
cat foo.json | joyce > result.json
```

Or, use [rc](https://www.npmjs.com/package/rc) or [answers](https://www.npmjs.com/package/answers) or any other option out there for gathering config data and then just pass it to Joyce.

### License

MIT
