import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import * as pkg from '../index.js';
import { convert } from '../convert.js';
import { convertMarkdown } from '../convert-markdown.js';

describe('API', () => {
  test('exports convert()', () => {
    assert.equal(typeof pkg.convert, 'function');
    assert.equal(pkg.convert, convert);
  });

  test('exports convertMarkdown()', () => {
    assert.equal(typeof pkg.convertMarkdown, 'function');
    assert.equal(pkg.convertMarkdown, convertMarkdown);
  });
});
