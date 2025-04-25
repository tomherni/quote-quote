import type { ConvertOptions } from '../types';
import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { convert } from '../convert.js';

describe('API', () => {
  describe('argument: "text"', () => {
    for (const value of [undefined, null, false, 0, true, 1, [], {}]) {
      test(`throws a TypeError when argument is ${value}`, () => {
        assert.throws(() => convert(value as string), {
          name: 'TypeError',
          message: 'quote-quote: "text" argument must be a string',
        });
      });
    }

    test('does not throw when argument is an empty string', () => {
      assert.doesNotThrow(() => convert(''));
    });
  });

  describe('argument: "options"', () => {
    for (const value of [false, 0, true, 1, '', 'foo', []]) {
      test(`throws a TypeError when argument is ${value}`, () => {
        assert.throws(() => convert('', value as unknown as ConvertOptions), {
          name: 'TypeError',
          message: 'quote-quote: "options" argument must be an object',
        });
      });
    }

    for (const value of [undefined, null, {}]) {
      test(`does not throw when argument is ${value}`, () => {
        assert.doesNotThrow(() =>
          convert('', value as unknown as ConvertOptions),
        );
      });
    }

    test(`does not throw when argument is omitted`, () => {
      assert.doesNotThrow(() => convert(''));
    });
  });

  describe('return value', () => {
    test('returns a string', () => {
      assert.equal(typeof convert(''), 'string');
    });
  });
});

describe('Basic scenarios', () => {
  describe('Single quotes', () => {
    const scenarios = [
      [`'Foo'`, `‘Foo’`],
      [`'Foo.'`, `‘Foo.’`],
      [`'Foo'.`, `‘Foo’.`],
      [`'Foo:'`, `‘Foo:’`],
      [`'Foo':`, `‘Foo’:`],
      [`'Foo!'`, `‘Foo!’`],
      [`'Foo'!`, `‘Foo’!`],
      [`'Foo?': bar`, `‘Foo?’: bar`],
      [`'Foo' bar`, `‘Foo’ bar`],
      [`Foo 'bar'`, `Foo ‘bar’`],
      [`'Foo bar'`, `‘Foo bar’`],
      [`Foo 'bar' baz`, `Foo ‘bar’ baz`],
      [`Foo 'bar' 'baz' qux`, `Foo ‘bar’ ‘baz’ qux`],
      // [`F'o'o`, `F‘o’o`],
      [`'1'`, `‘1’`],
      // [`'12'`, `‘12’`],
      [`Foo '1' bar`, `Foo ‘1’ bar`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('Double quotes', () => {
    const scenarios = [
      [`"Foo"`, `“Foo”`],
      [`"Foo."`, `“Foo.”`],
      [`"Foo".`, `“Foo”.`],
      [`"Foo:"`, `“Foo:”`],
      [`"Foo":`, `“Foo”:`],
      [`"Foo!"`, `“Foo!”`],
      [`"Foo"!`, `“Foo”!`],
      [`"Foo?": bar`, `“Foo?”: bar`],
      [`"Foo" bar`, `“Foo” bar`],
      [`Foo "bar"`, `Foo “bar”`],
      [`"Foo bar"`, `“Foo bar”`],
      [`Foo "bar" baz`, `Foo “bar” baz`],
      [`Foo "bar" "baz" qux`, `Foo “bar” “baz” qux`],
      // [`F"o"o`, `F“o”o`],
      [`"1"`, `“1”`],
      [`"12"`, `“12”`],
      [`Foo "1" bar`, `Foo “1” bar`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('Contractions and possessives', () => {
    const scenarios = [
      [`Foo's`, `Foo’s`],
      [`Foo't`, `Foo’t`],
      [`Foo's bar't`, `Foo’s bar’t`],
      [`Foo's't`, `Foo’s’t`],
      [`Foo's't bar't's`, `Foo’s’t bar’t’s`],
      [`Foo 1's bar 23's`, `Foo 1’s bar 23’s`],
      [`Foo 'ba'r`, `Foo ’ba’r`],
      [`'Foo`, `’Foo`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('Abbreviated years', () => {
    const scenarios = [
      [`'90`, `’90`],
      [`'00`, `’00`],
      [`Foo '90`, `Foo ’90`],
      [`Foo '90 bar`, `Foo ’90 bar`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('Primes', () => {
    const scenarios = [
      [`''''`, `⁗`],
      [`'''`, `‴`],
      [`''`, `″`],
      [`6'1"`, `6′1″`],
      [`Foo 6'1" bar`, `Foo 6′1″ bar`],
      [`Foo bar''' baz`, `Foo bar‴ baz`],
      [`Foo bar'''' baz`, `Foo bar⁗ baz`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });
});

describe('Nested quotes', () => {
  describe('Quotes within single quotes', () => {
    const scenarios = [
      [`'"Foo"'`, `‘“Foo”’`],
      [`'Foo 'bar' baz'`, `‘Foo ‘bar’ baz’`],
      [`'Foo ba'r baz'`, `‘Foo ba’r baz’`],
      [`'Foo "bar" baz'`, `‘Foo “bar” baz’`],
      [`'Foo '90 bar'`, `‘Foo ’90 bar’`],
      [`'Foo 1's bar 23's baz'`, `‘Foo 1’s bar 23’s baz’`],
      [`'Foo 'bar '90 baz' qux'`, `‘Foo ‘bar ’90 baz’ qux’`],
      [`'Foo 6'1" bar'`, `‘Foo 6′1″ bar’`],
      [`'Foo bar''' baz'`, `‘Foo bar‴ baz’`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('Quotes within double quotes', () => {
    const scenarios = [
      [`"'Foo'"`, `“‘Foo’”`],
      [`"Foo "bar" baz"`, `“Foo “bar” baz”`],
      [`"Foo ba'r baz"`, `“Foo ba’r baz”`],
      [`"Foo 'bar' baz"`, `“Foo ‘bar’ baz”`],
      [`"Foo '90 bar"`, `“Foo ’90 bar”`],
      [`"Foo 1's bar 23's baz"`, `“Foo 1’s bar 23’s baz”`],
      [`"Foo 'bar '90 baz' qux"`, `“Foo ‘bar ’90 baz’ qux”`],
      [`"Foo 6'1" bar"`, `“Foo 6′1″ bar”`],
      [`"Foo bar''' baz"`, `“Foo bar‴ baz”`],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });

  describe('TODO', () => {
    const scenarios = [
      [
        `"Foo 'bar' '90s baz's 'qux 6'1"'"`,
        `“Foo ‘bar’ ’90s baz’s ‘qux 6′1″’”`,
      ],
    ];

    for (const [text, expected] of scenarios) {
      test(`Converts: ${text}`, () => {
        assert.equal(convert(text), expected);
      });
    }
  });
});

describe('Special characters', () => {
  const scenarios = [
    // Inverted question/exclamation marks
    [`'¡Foo!'`, `‘¡Foo!’`],
    [`"¡Foo!"`, `“¡Foo!”`],
    [`'¿Foo?'`, `‘¿Foo?’`],
    [`"¿Foo?"`, `“¿Foo?”`],

    // Accents
    [`'Água é'`, `‘Água é’`],
    [`"Água é"`, `“Água é”`],
    [`"'Água é'"`, `“‘Água é’”`],
    [`Eu disse "água 'é'"`, `Eu disse “água ‘é’”`],

    // Ellipsis
    [`'Foo\u2026' "Foo\u2026"`, `‘Foo\u2026’ “Foo\u2026”`],
    [`'Foo\u2026 bar' "Foo\u2026 bar"`, `‘Foo\u2026 bar’ “Foo\u2026 bar”`],

    // Newlines
    [`'Foo\nbar'`, `‘Foo\nbar’`],
    [`"Foo\nbar"`, `“Foo\nbar”`],

    // En dashes
    [`'Foo 10\u201315 bar'`, `‘Foo 10\u201315 bar’`],
    [`"Foo 10\u201315 bar"`, `“Foo 10\u201315 bar”`],

    // Em dashes
    [`'Foo bar\u2014baz qux'`, `‘Foo bar\u2014baz qux’`],
    [`"Foo bar\u2014baz qux"`, `“Foo bar\u2014baz qux”`],
    [`'Foo\u2014"bar"\u2014baz'`, `‘Foo\u2014“bar”\u2014baz’`],
    [`"Foo\u2014'bar'\u2014baz"`, `“Foo\u2014‘bar’\u2014baz”`],

    // Misc.
    [`'_'`, `‘_’`],
    [`"_"`, `“_”`],
    [`Foo '-' bar`, `Foo ‘-’ bar`],
    // [`Foo "-" bar`, `Foo “-” bar`],
  ];

  for (const [text, expected] of scenarios) {
    test(`Converts: ${text}`, () => {
      assert.equal(convert(text), expected);
    });
  }
});

describe('Small sentences', () => {
  const scenarios = [
    [`Y'all're goin' to love it!`, `Y’all’re goin’ to love it!`],
    [`Don't stop believin'.`, `Don’t stop believin’.`],
    [`"That's a 'magic' shoe."`, `“That’s a ‘magic’ shoe.”`],
    [`"He said, 'It's 1980s style.'"`, `“He said, ‘It’s 1980s style.’”`],
    [`She's got a 6'2" frame.`, `She’s got a 6′2″ frame.`],
    [`'Twas the night...`, `’Twas the night...`],
    [`"'Twas the night..."`, `“’Twas the night...”`],
    [`"Or 'twasn't"`, `“Or ’twasn’t”`],
    [`The board is 'at least' 3' by 4'`, `The board is ‘at least’ 3′ by 4′`],
    [`"Since 'when?'" was the question.`, `“Since ‘when?’” was the question.`],
    [
      `She's got the teacher's pet's toy.`,
      `She’s got the teacher’s pet’s toy.`,
    ],
    [
      `His "favorite saying": "'Til the end of days."`,
      `His “favorite saying”: “’Til the end of days.”`,
    ],
    [
      `The teacher's '98 notes read: "It's 'not' plagiarism."`,
      `The teacher’s ’98 notes read: “It’s ‘not’ plagiarism.”`,
    ],
    [
      `"Don't ever call me 'Johnny-boy' again," he warned.`,
      `“Don’t ever call me ‘Johnny-boy’ again,” he warned.`,
    ],
    [
      `'Did he really say, "I'm leaving"?' asked John.`,
      `‘Did he really say, “I’m leaving”?’ asked John.`,
    ],
    [
      `"It's called 'The End of Time'," she said.`,
      `“It’s called ‘The End of Time’,” she said.`,
    ],
    [
      `"The witness stated, 'I heard him say, "It's done," before leaving.'"`,
      `“The witness stated, ‘I heard him say, “It’s done,” before leaving.’”`,
    ],
    // [
    //   `You must score '100%' to become '#1'.`,
    //   `You must score ‘100%’ to become ‘#1’.`,
    // ],
    // [
    //   `You must score "100%" to become "#1".`,
    //   `You must score “100%” to become “#1”.`,
    // ],
    // [
    //   `"Newsflash": "It must have been '10–15' degrees yesterday."`,
    //   `“Newsflash”: “It must have been ‘10–15’ degrees yesterday.”`,
    // ],
  ];

  for (const [text, expected] of scenarios) {
    test(`Converts: ${text}`, () => {
      assert.equal(convert(text), expected);
    });
  }
});

describe('Excerpts', () => {
  test('Adventures of Huckleberry Finn, by Mark Twain', () => {
    const text = `
      "Why, my boy, you are all out of breath. Did you come for your interest?"
      "No, sir," I says; "is there some for me?"
      "Oh, yes, a half-yearly is in last night—over a hundred and fifty dollars. Quite a fortune for you. You had better let me invest it along with your six thousand, because if you take it you'll spend it."
      "No, sir," I says, "I don't want to spend it. I don't want it at all—nor the six thousand, nuther. I want you to take it; I want to give it to you—the six thousand and all."
      He looked surprised. He couldn't seem to make it out. He says:
      "Why, what can you mean, my boy?"
      I says, "Don't you ask me no questions about it, please. You'll take it—won't you?"
      He says:
      "Well, I'm puzzled. Is something the matter?"
      "Please take it," says I, "and don't ask me nothing—then I won't have to tell no lies."
      He studied a while, and then he says:
      "Oho-o! I think I see. You want to SELL all your property to me—not give it. That's the correct idea."
    `;

    const expected = `
      “Why, my boy, you are all out of breath. Did you come for your interest?”
      “No, sir,” I says; “is there some for me?”
      “Oh, yes, a half-yearly is in last night—over a hundred and fifty dollars. Quite a fortune for you. You had better let me invest it along with your six thousand, because if you take it you’ll spend it.”
      “No, sir,” I says, “I don’t want to spend it. I don’t want it at all—nor the six thousand, nuther. I want you to take it; I want to give it to you—the six thousand and all.”
      He looked surprised. He couldn’t seem to make it out. He says:
      “Why, what can you mean, my boy?”
      I says, “Don’t you ask me no questions about it, please. You’ll take it—won’t you?”
      He says:
      “Well, I’m puzzled. Is something the matter?”
      “Please take it,” says I, “and don’t ask me nothing—then I won’t have to tell no lies.”
      He studied a while, and then he says:
      “Oho-o! I think I see. You want to SELL all your property to me—not give it. That’s the correct idea.”
    `;

    assert.equal(convert(text), expected);
  });

  test('Pride and Prejudice, by Jane Austen', () => {
    const text = `
      "I hope Mr. Bingley will like it, Lizzy."
      "We are not in a way to know what Mr. Bingley likes," said her mother, resentfully, "since we are not to visit.{7}"
      "But you forget, mamma," said Elizabeth, "that we shall meet him at the assemblies, and that Mrs. Long has promised to introduce him."
      "I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her."
      "No more have I," said Mr. Bennet; "and I am glad to find that you do not depend on her serving you."
      Mrs. Bennet deigned not to make any reply; but, unable to contain herself, began scolding one of her daughters.
      "Don't keep coughing so, Kitty, for heaven's sake! Have a little compassion on my nerves. You tear them to pieces."
      "Kitty has no discretion in her coughs," said her father; "she times them ill."
      "I do not cough for my own amusement," replied Kitty, fretfully. "When is your next ball to be, Lizzy?"
      "To-morrow fortnight."
    `;

    const expected = `
      “I hope Mr. Bingley will like it, Lizzy.”
      “We are not in a way to know what Mr. Bingley likes,” said her mother, resentfully, “since we are not to visit.{7}”
      “But you forget, mamma,” said Elizabeth, “that we shall meet him at the assemblies, and that Mrs. Long has promised to introduce him.”
      “I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her.”
      “No more have I,” said Mr. Bennet; “and I am glad to find that you do not depend on her serving you.”
      Mrs. Bennet deigned not to make any reply; but, unable to contain herself, began scolding one of her daughters.
      “Don’t keep coughing so, Kitty, for heaven’s sake! Have a little compassion on my nerves. You tear them to pieces.”
      “Kitty has no discretion in her coughs,” said her father; “she times them ill.”
      “I do not cough for my own amusement,” replied Kitty, fretfully. “When is your next ball to be, Lizzy?”
      “To-morrow fortnight.”
    `;

    assert.equal(convert(text), expected);
  });
});

describe('ellipsis', () => {
  test('does not convert "..." to an ellipsis by default', () => {
    assert.equal(convert('"xx..."'), '“xx...”');
  });

  test('does not convert "..." to an ellipsis when configured not to do so', () => {
    [false, undefined, null].forEach((ellipsis) => {
      assert.equal(
        convert('"xx..."', {
          ellipsis,
        } as unknown as ConvertOptions),
        '“xx...”',
      );
    });
  });

  test('converts "..." to an ellipsis when configured', () => {
    assert.equal(convert('"xx..."', { ellipsis: true }), '“xx…”');
  });
});
