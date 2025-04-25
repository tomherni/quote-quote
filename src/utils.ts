import type { ConvertOptions, ConvertMarkdownOptions } from './types.js';

function isObject(value: unknown): value is object {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Throw a TypeError if the provided arguments are not of the expected types.
 */
export function throwForInvalidArgumentTypes(
  text: string,
  options?: ConvertOptions | ConvertMarkdownOptions,
): void {
  // If a convert function was not provided with a string then it should also
  // not be returned, nor should the function fail silently.
  if (typeof text !== 'string') {
    throw new TypeError('quote-quote: "text" argument must be a string');
  }
  if (options != null && !isObject(options)) {
    throw new TypeError('quote-quote: "options" argument must be an object');
  }
}
