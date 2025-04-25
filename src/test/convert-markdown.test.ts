import type { ConvertMarkdownOptions } from '../types';
import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { convertMarkdown } from '../convert-markdown.js';

describe('API', () => {
  describe('argument: "text"', () => {
    for (const value of [undefined, null, false, 0, true, 1, [], {}]) {
      test(`throws a TypeError when argument is ${value}`, () => {
        assert.throws(() => convertMarkdown(value as string), {
          name: 'TypeError',
          message: 'quote-quote: "text" argument must be a string',
        });
      });
    }

    test('does not throw when argument is an empty string', () => {
      assert.doesNotThrow(() => convertMarkdown(''));
    });
  });

  describe('argument: "options"', () => {
    for (const value of [false, 0, true, 1, '', 'foo', []]) {
      test(`throws a TypeError when argument is ${value}`, () => {
        assert.throws(
          () => convertMarkdown('', value as unknown as ConvertMarkdownOptions),
          {
            name: 'TypeError',
            message: 'quote-quote: "options" argument must be an object',
          },
        );
      });
    }

    for (const value of [undefined, null, {}]) {
      test(`does not throw when argument is ${value}`, () => {
        assert.doesNotThrow(() =>
          convertMarkdown('', value as unknown as ConvertMarkdownOptions),
        );
      });
    }

    test(`does not throw when argument is omitted`, () => {
      assert.doesNotThrow(() => convertMarkdown(''));
    });
  });

  describe('return value', () => {
    test('returns a string', () => {
      assert.equal(typeof convertMarkdown(''), 'string');
    });
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

describe('ellipsis', () => {
  test('does not convert "..." to an ellipsis by default', () => {
    assert.equal(convertMarkdown('"xx..."'), '“xx...”');
  });

  test('does not convert "..." to an ellipsis when configured not to do so', () => {
    [false, undefined, null].forEach((ellipsis) => {
      assert.equal(
        convertMarkdown('"xx..."', {
          ellipsis,
        } as unknown as ConvertMarkdownOptions),
        '“xx...”',
      );
    });
  });

  test('converts "..." to an ellipsis when configured', () => {
    assert.equal(convertMarkdown('"xx..."', { ellipsis: true }), '“xx…”');
  });

  test('does not convert "..." to an ellipsis in markdown', () => {
    assert.equal(
      convertMarkdown('xx `...` xx', { ellipsis: true }),
      'xx `...` xx',
    );
  });
});
