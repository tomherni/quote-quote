import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import * as pkg from '../index.js';
import { convert } from '../convert.js';

describe('API', () => {
  test('exports convert()', () => {
    assert.equal(typeof pkg.convert, 'function');
    assert.equal(pkg.convert, convert);
  });
});
