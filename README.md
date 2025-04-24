# “QuoteQuote”

Convert boring, straight quotes (" and ') to beautiful, typographically correct curly quotes — also known as _smart quotes_.

## Highlights

- Converts straight single/double quotes to curly quotes.
- Converts straight quotes used as primes to prime symbols.
- Handles contractions, possessives and abbreviated years.
- Lightweight, zero dependencies, modern, and tree-shakeable.

## Installing

Install with a package manager such as npm, pnpm or yarn.

```sh
npm install quote-quote
```

## Example

### ESM

```js
import { convert } from 'quote-quote';

const text = `"That's a 'magic' shoe."`;

convert(text); // “That’s a ‘magic’ shoe.”
```

### CommonJS

```js
const { convert } = require('quote-quote');

const text = `"That's a 'magic' shoe."`;

convert(text); // “That’s a ‘magic’ shoe.”
```

## API Summary

|                     |                                                      |
| ------------------- | ---------------------------------------------------- |
| `convert()`         | Convert straight quotes to curly quotes.             |
| `convertMarkdown()` | Convert straight quotes to curly quotes in Markdown. |

## API

### convert(text[, options])

Convert straight quotes to curly quotes.

|                      |                                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| `text`               | `String` – the text that may contain straight quotes                   |
| [`options`]          | `Object` – optional options                                            |
| [`options.ellipsis`] | `Boolean` – whether to also convert "..." to an ellipsis               |
| Returns              | `String`                                                               |
| Throws               | `TypeError` – if `text` is not a `String` or `options` not an `Object` |

Example:

```js
import { convert } from 'quote-quote';

const text = `"That's a 'magic' shoe."`;

convert(text); // “That’s a ‘magic’ shoe.”
```

Example using `options`:

```js
import { convert } from 'quote-quote';

const text = `"That's a 'magic' shoe..."`;

convert(text, { ellipsis: true }); // “That’s a ‘magic’ shoe…”
```

### convertMarkdown(text[, options])

Convert straight quotes to curly quotes in text formatted as Markdown. This means that quotes inside code are not converted.

|                      |                                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| `text`               | `String` – the text that may contain straight quotes                   |
| [`options`]          | `Object` – optional options                                            |
| [`options.ellipsis`] | `Boolean` – whether to also convert "..." to an ellipsis               |
| Returns              | `String`                                                               |
| Throws               | `TypeError` – if `text` is not a `String` or `options` not an `Object` |

Example:

```js
import { convertMarkdown } from 'quote-quote';

const text = '"Hello `"world"`" they said.';

convertMarkdown(text); // “Hello `"world"`” they said.
```

Example using `options`:

```js
import { convertMarkdown } from 'quote-quote';

const text = '"Hello `"world"`" they said...';

convertMarkdown(text, { ellipsis: true }); // “Hello `"world"`” they said…
```

## Versioning

This project follows [SemVer](https://semver.org/) (Semantic Versioning).
