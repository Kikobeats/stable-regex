# stable-regex

> Fast, deterministic regex checks for hot paths.

![Last version](https://img.shields.io/github/tag/Kikobeats/stable-regex.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/stable-regex.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/stable-regex)
[![NPM Status](https://img.shields.io/npm/dm/stable-regex.svg?style=flat-square)](https://www.npmjs.org/package/stable-regex)

## Why this package exists

When a regex has `g` or `y`, `.test()` mutates `lastIndex`.

```js
const pattern = /hello/g

pattern.test('hello') // true
pattern.test('hello') // false
pattern.test('hello') // true
```

In hot code paths, developers usually pick one of three options:

- `pattern.test(input)` (fast but wrong for reused stateful regexes)
- `new RegExp(...).test(input)` each call (correct but allocates and is slower)
- manual `pattern.lastIndex = 0` before test (correct but repetitive boilerplate)

The `stable-regex` library resets the index just when needed, keeping the performance stable and predictable.primitive.

Use `stable-regex` when you:

- Reuse precompiled regexes in request handlers/parsers/normalizers.
- Need deterministic boolean checks with `g`/`y` patterns.
- Want high throughput without repeating reset boilerplate.

This library is **2.6x faster** than recreating a regex each call, which is the solution most used.

## Install

```bash
npm install stable-regex
```

## Usage

```js
const stableRegex = require('stable-regex')

const pattern = /hello/g

stableRegex(pattern, 'hello') // true
stableRegex(pattern, 'hello') // true
stableRegex(pattern, 'hello') // true
```

## API

### `stableRegex(pattern, input)`

#### `pattern`

*Required*
Type: `RegExp` or RegExp-like object exposing `.test()`

If `lastIndex` is numeric, it is reset before testing.

#### `input`

*Required*
Type: `string`

Returns `boolean`.

Throws `TypeError` when `pattern` does not expose `.test()`.

## Benchmark

## Naive alternatives

Node `v25.6.1` on Apple Silicon, `12,000,000` iterations:

| Case | Ops/sec | ns/op | Correct for reused `/.../g` |
| --- | ---: | ---: | :---: |
| `pattern.test(input)` | 78,175,641 | 12.79 | ❌ |
| `new RegExp(...).test(input)` each call | 18,652,815 | 53.61 | ✅ |
| manual `lastIndex = 0; test()` | 48,754,401 | 20.51 | ✅ |
| `stableRegex(pattern, input)` | 48,406,721 | 20.66 | ✅ |

### Real-world numbers

From the `@unavatar/core` hot path (`src/avatar/auto.js`) comparing:

- `stableRegex(precompiledPattern, input)`
- `dataUriRegex().test(input)` (fresh regex each call)

Setup: Node `v25.6.1`, Apple Silicon, `10,000,000` iterations, `7` rounds, median.

| Case | stable-regex (ms) | fresh regex each call (ms) | Speedup |
| --- | ---: | ---: | ---: |
| Data URI match (`data:image/...`) | 288.50 | 976.70 | **3.39x** |
| Non-match (`https://example.com/...`) | 67.07 | 730.39 | **10.89x** |

That translates to:

- **70.46% less time** on matching inputs.
- **90.82% less time** on non-matching inputs.

## License

**stable-regex** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/stable-regex/blob/master/LICENSE.md) License.

Maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/stable-regex/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
