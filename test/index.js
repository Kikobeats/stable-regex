'use strict'

const test = require('ava')

const stableRegex = require('..')

test('returns the same result as test for a plain regexp', t => {
  const pattern = /hello/
  t.true(stableRegex(pattern, 'hello world'))
  t.false(stableRegex(pattern, 'bye world'))
})

test('prevents stateful global regex false negatives across repeated checks', t => {
  const pattern = /hello/g

  t.true(stableRegex(pattern, 'hello'))
  t.true(stableRegex(pattern, 'hello'))
  t.true(stableRegex(pattern, 'hello'))
})

test('prevents stateful sticky regex false negatives across repeated checks', t => {
  const pattern = /hello/y

  t.true(stableRegex(pattern, 'hello'))
  t.true(stableRegex(pattern, 'hello'))
})

test('throws when pattern is not regexp-like', t => {
  const error = t.throws(() => stableRegex(null, 'hello'))
  t.is(error.message, 'Expected a RegExp-like pattern exposing a `test` method.')
})
