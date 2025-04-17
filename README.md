# “QuoteQuote”

Convert boring, straight quotes (" and ') to beautiful, typographically correct curly quotes — also known as _smart quotes_.

## Highlights

- Converts straight single/double quotes to curly quotes.
- Handles contractions, possessives and abbreviated years.
- Converts straight quotes used as primes to prime symbols.
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

## API

Note: API examples use ESM, but CommonJS is also supported.

### convert(text)

Converts straight quotes to curly quotes and primes.

|         |                                                        |
| ------- | ------------------------------------------------------ |
| `text`  | `String` – the text that may contain quotes to convert |
| Returns | `String`                                               |
| Throws  | `TypeError` – if `text` is not of type `String`        |

Example:

```js
import { convert } from 'quote-quote';

const text = `"That's a 'magic' shoe."`;

convert(text); // “That’s a ‘magic’ shoe.”
```

## Versioning

This project follows [SemVer](https://semver.org/) (Semantic Versioning).
