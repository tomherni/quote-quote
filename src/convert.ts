import type { ConvertOptions } from './types.js';
import { throwForInvalidArgumentTypes } from './utils.js';

/**
 * Convert straight quotes to curly quotes.
 *
 * This includes:
 * - Straight single/double quotes to left/right quotation marks,
 * - Straight quotes used as primes to proper prime symbols.
 * - Contractions and possessives like "don't", "it's", or "John's",
 *
 * @param {string} text - the text that may contain straight quotes
 * @param {Object} [options]
 * @param {boolean} [options.ellipsis] - whether to also convert "..." to an ellipsis
 * @return {string}
 * @throws {TypeError} if `text` is not a `String`
 *
 * @example
 * convert(`"That's a 'magic' shoe."`); // “That’s a ‘magic’ shoe.”
 */
export function convert(text: string, options?: ConvertOptions): string {
  throwForInvalidArgumentTypes(text, options);

  const textWithCurlyQuotes = text
    // Quadruple and triple prime.
    .replace(/\u0027\u0027\u0027\u0027/g, '\u2057')
    .replace(/\u0027\u0027\u0027/g, '\u2034')

    // Opening double quote. When: preceded by non-word or start of string,
    // and followed by a word character or similar.
    .replace(
      /([^\p{L}0-9_]|^)\u0022([\p{L}0-9_\u0027\u00A1\u00BF])/gu,
      '$1\u201c$2',
    )

    // Closing double quote (1/2). When: preceded by an opening double quote
    // and anything but a straight double quote, followed by end of line or
    // another double quote (straight or curly).
    .replace(
      /(\u201c[^\u0022]*)\u0022([^\u0022]*$|[^\u201c\u0022]*\u201c)/g,
      '$1\u201d$2',
    )
    // Closing double quote (2/2). When: remaining double quote that is not
    // preceded by a digit.
    .replace(/([^0-9])\u0022/g, '$1\u201d')

    // Double prime (1/2).
    .replace(/\u0027\u0027/g, '\u2033')

    // Opening single quote. When: preceded by non-word/start and followed by
    // a non-whitespace.
    .replace(/([^\p{L}0-9_]|^)\u0027(\S)/gu, '$1\u2018$2')

    // Closing single quote (1/4). When: between word characters. Covers e.g.
    // contractions and possessions.
    .replace(/([\p{L}0-9_])\u0027([\p{L}])/giu, '$1\u2019$2')

    // Closing single quote (2/4). When: opening single quote was applied to
    // a digit. Covers abbreviated years, such as '90s.
    .replace(
      /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[\p{L}])/giu,
      '\u2019$2$3',
    )

    // Closing single quote (3/4). When: after text or an opening quote.
    .replace(/((\u2018[^\u0027]*)|[\p{L}])\u0027([^0-9]|$)/giu, '$1\u2019$3')

    // Closing single quote (4/4). When: mismatched or improperly nested
    // opening single quotes.
    .replace(
      /(\B|^)\u2018(?=([^\u2018\u2019]*\u2019\b)*([^\u2018\u2019]*\B[^\p{L}0-9_][\u2018\u2019]\b|[^\u2018\u2019]*$))/giu,
      '$1\u2019',
    )

    // Double prime (2/2) and prime. When: any remaining quotes.
    .replace(/\u0022/g, '\u2033')
    .replace(/\u0027/g, '\u2032');

  return options?.ellipsis
    ? textWithCurlyQuotes.replace(/\.{3}/g, '\u2026')
    : textWithCurlyQuotes;
}
