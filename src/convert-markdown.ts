import type { ConvertMarkdownOptions } from './types.js';
import { convert } from './convert.js';
import { throwForInvalidArgumentTypes } from './utils.js';

type PlaceholderConfig = { regex: RegExp; token: string; code: string[] };

const fencedBlockRegex =
  /(^|(?<!\\)(?:\r\n|\n))([`,~]{3})([\s\S]*?)(?<!\\)(?:\r\n|\n)(\2)(?=(?:\r\n|\n)|$)/g;
const indentedBlockRegex =
  /(^|(?<!\\)(?:\r\n|\n))( {4}|\t)([\s\S]*?)(?=(?<!\\)(?:\r\n|\n)(?!\2)|$)/g;
const codeSingleRegex = /(?<!\\)`([\s\S]*?)(?<!\\)`/g;
const codeDoubleRegex = /(?<!\\)``([\s\S]*?)(?<!\\)``/g;
const codeTripleRegex = /(?<!\\)```([\s\S]*?)(?<!\\)```/g;

/**
 * Convert straight quotes to curly quotes in text formatted as Markdown. This
 * means that quotes inside code are not converted.
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
 * convert('"Hello `"world"`" they said.'); // “Hello `"world"`” they said.
 */
export function convertMarkdown(
  text: string,
  options?: ConvertMarkdownOptions,
): string {
  throwForInvalidArgumentTypes(text, options);

  // The order matters. For efficiency, we want to replace as few matches as
  // possible, which means to start with possibly the lengthiest matches to
  // avoid replacing nested code.
  // Also, in order to abort quoting logic, code block placeholders contain
  // newlines to avoid touching quotes.
  const placeholderConfigs: PlaceholderConfig[] = [
    { regex: fencedBlockRegex, token: '\n_QQxFENCED_\n', code: [] },
    { regex: indentedBlockRegex, token: '\n_QQxINDENTED_\n', code: [] },
    { regex: codeTripleRegex, token: '_QQxTRIPLE_', code: [] },
    { regex: codeDoubleRegex, token: '_QQxDOUBLE_', code: [] },
    { regex: codeSingleRegex, token: '_QQxSINGLE_', code: [] },
  ];

  // Replace Markdown code with placeholders.
  const textWithoutCode = placeholderConfigs.reduce((all, cur) => {
    return all.replace(cur.regex, (match) => {
      cur.code.push(match);
      return cur.token;
    });
  }, text);

  // Convert quotes in the Markdown text that is now without code.
  const convertedTextWithoutCode = convert(textWithoutCode, options);

  // Put back the Markdown code in the text by replacing the placeholders.
  const convertedTextWithCode = [...placeholderConfigs]
    .reverse()
    .reduce((all, cur) => {
      return all.replaceAll(cur.token, () => shiftFrom(cur.code));
    }, convertedTextWithoutCode);

  // Ensure all code ended up back in the text again.
  if (placeholderConfigs.some((arr) => arr.code.length !== 0)) {
    throw new Error(
      'quote-quote: "convertMarkdown()" could not parse Markdown',
    );
  }

  return convertedTextWithCode;
}

function shiftFrom(arr: string[]): string {
  const value = arr.shift();

  // It could be that the original text already contained code placeholders,
  // in which case we would be putting back code in the wrong place.
  if (typeof value !== 'string') {
    throw new Error(
      'quote-quote: "convertMarkdown()" could not parse Markdown',
    );
  }
  return value;
}
