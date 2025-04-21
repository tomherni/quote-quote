import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { convertMarkdown } from '../convert-markdown.js';

describe('API', () => {
  for (const value of [undefined, null, false, 0, true, 1, [], {}]) {
    test(`throws a TypeError when its argument is ${value}`, () => {
      assert.throws(() => convertMarkdown(value as string), {
        name: 'TypeError',
        message: 'quote-quote: "convertMarkdown()" argument must be a string',
      });
    });
  }

  test('does not throw when its argument is an empty string', () => {
    assert.doesNotThrow(() => convertMarkdown(''));
  });

  test('returns a string', () => {
    assert.equal(typeof convertMarkdown(''), 'string');
  });
});

describe('basic scenarios', () => {
  for (const c of ['`', '``', '```']) {
    describe(`inline code with ${c}`, () => {
      [
        // Only code in text.
        [`${c}'xx'${c}`, `${c}'xx'${c}`],
        [`${c}"xx"${c}`, `${c}"xx"${c}`],
        // Text begins with code.
        [`${c}'xx'${c} xx`, `${c}'xx'${c} xx`],
        [`${c}"xx"${c} xx`, `${c}"xx"${c} xx`],
        // Text ends with code.
        [`xx ${c}'xx'${c}`, `xx ${c}'xx'${c}`],
        [`xx ${c}"xx"${c}`, `xx ${c}"xx"${c}`],
        // Code is surrounded by text.
        [`xx ${c}'xx'${c} xx`, `xx ${c}'xx'${c} xx`],
        [`xx ${c}"xx"${c} xx`, `xx ${c}"xx"${c} xx`],
      ].forEach(([text, expected]) => {
        test(`does not convert in code: ${text}`, () => {
          assert.equal(convertMarkdown(text), expected);
        });
      });

      [
        // Only code in text.
        [`'${c}'xx'${c}'`, `‘${c}'xx'${c}’`],
        [`"${c}"xx"${c}"`, `“${c}"xx"${c}”`],
        // Text begins with code.
        [`'${c}'xx'${c} xx'`, `‘${c}'xx'${c} xx’`],
        [`"${c}"xx"${c} xx"`, `“${c}"xx"${c} xx”`],
        // Text ends with code.
        [`'xx ${c}'xx'${c}'`, `‘xx ${c}'xx'${c}’`],
        [`"xx ${c}"xx"${c}"`, `“xx ${c}"xx"${c}”`],
        // Code is surrounded by text.
        [`'xx ${c}'xx'${c} xx'`, `‘xx ${c}'xx'${c} xx’`],
        [`"xx ${c}"xx"${c} xx"`, `“xx ${c}"xx"${c} xx”`],
      ].forEach(([text, expected]) => {
        test(`continues surrounding quotes: ${text}`, () => {
          assert.equal(convertMarkdown(text), expected);
        });
      });
    });
  }

  // Array contains a TAB (\t) and 4 spaces.
  for (const c of ['	', '    ']) {
    describe(`indented code blocks with ${c}`, () => {
      [
        // Only code in text.
        [`${c}'xx'`, `${c}'xx'`],
        [`${c}"xx"`, `${c}"xx"`],
        // Text begins with code.
        [`${c}'xx'\nxx`, `${c}'xx'\nxx`],
        [`${c}"xx"\nxx`, `${c}"xx"\nxx`],
        // Text ends with code.
        [`xx\n${c}'xx'`, `xx\n${c}'xx'`],
        [`xx\n${c}"xx"`, `xx\n${c}"xx"`],
        // Code is surrounded by text.
        [`xx\n${c}'xx'\nxx`, `xx\n${c}'xx'\nxx`],
        [`xx\n${c}"xx"\nxx`, `xx\n${c}"xx"\nxx`],
      ].forEach(([text, expected]) => {
        test(`does not convert in code: ${text}`, () => {
          assert.equal(convertMarkdown(text), expected);
        });
      });
    });
  }

  for (const c of ['~~~', '```']) {
    describe(`fenced code blocks with ${c}`, () => {
      [
        // Only code in text.
        [`${c}\n'xx'\n${c}`, `${c}\n'xx'\n${c}`],
        [`${c}\n"xx"\n${c}`, `${c}\n"xx"\n${c}`],
        // Text begins with code.
        [`${c}\n'xx'\n${c}\nxx`, `${c}\n'xx'\n${c}\nxx`],
        [`${c}\n"xx"\n${c}\nxx`, `${c}\n"xx"\n${c}\nxx`],
        // Text ends with code.
        [`xx\n${c}\n'xx'\n${c}`, `xx\n${c}\n'xx'\n${c}`],
        [`xx\n${c}\n"xx"\n${c}`, `xx\n${c}\n"xx"\n${c}`],
        // Code is surrounded by text.
        [`xx\n${c}\n'xx'\n${c}\nxx`, `xx\n${c}\n'xx'\n${c}\nxx`],
        [`xx\n${c}\n"xx"\n${c}\nxx`, `xx\n${c}\n"xx"\n${c}\nxx`],
      ].forEach(([text, expected]) => {
        test(`does not convert in code: ${text}`, () => {
          assert.equal(convertMarkdown(text), expected);
        });
      });
    });
  }
});

describe('escaping', () => {
  [
    // Only code in text.
    ["\\`'xx'\\`", '\\`‘xx’\\`'],
    ['\\`"xx"\\`', '\\`“xx”\\`'],
    // Text begins with code.
    ["\\`'xx'\\` xx", '\\`‘xx’\\` xx'],
    ['\\`"xx"\\` xx', '\\`“xx”\\` xx'],
    // Text ends with code.
    ["xx \\`'xx'\\`", 'xx \\`‘xx’\\`'],
    ['xx \\`"xx"\\`', 'xx \\`“xx”\\`'],
    // Code is surrounded by text.
    ["xx \\`'xx'\\` xx", 'xx \\`‘xx’\\` xx'],
    ['xx \\`"xx"\\` xx', 'xx \\`“xx”\\` xx'],
  ].forEach(([text, expected]) => {
    test(`converts in escaped code: ${text}`, () => {
      assert.equal(convertMarkdown(text), expected);
    });
  });
});

describe('mixing code blocks', () => {
  test('larger document', () => {
    const text = `# "Xx."
\`\`\`
xx "xx" xx
\`\`\`
\`\`\`
xx "xx" xx
\`\`\`
"Xx."
\`\`\`xx
xx "xx" xx
\`\`\`
~~~
xx "xx" xx
~~~
~~~
xx "xx" xx
~~~
"Xx."
    "xx"
    "xx"
\t"xx"
\t"xx"
~~~xx
xx "xx" xx
~~~
"Xx."`;

    const expected = `# “Xx.”
\`\`\`
xx "xx" xx
\`\`\`
\`\`\`
xx "xx" xx
\`\`\`
“Xx.”
\`\`\`xx
xx "xx" xx
\`\`\`
~~~
xx "xx" xx
~~~
~~~
xx "xx" xx
~~~
“Xx.”
    "xx"
    "xx"
\t"xx"
\t"xx"
~~~xx
xx "xx" xx
~~~
“Xx.”`;

    assert.equal(convertMarkdown(text), expected);
  });
});
