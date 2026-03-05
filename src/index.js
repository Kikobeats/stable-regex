'use strict'

module.exports = (pattern, input) => {
  if (!pattern || typeof pattern.test !== 'function') {
    throw new TypeError('Expected a RegExp-like pattern exposing a `test` method.')
  }

  if (typeof pattern.lastIndex === 'number') {
    pattern.lastIndex = 0
  }

  return pattern.test(input)
}
