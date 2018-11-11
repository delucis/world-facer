import test from 'ava'
import { toFixed } from '../lib/math-utils'

test('it can round a float to a fixed precision', t => {
  t.is(toFixed(Math.PI, 3), 3.142)
})

test('it can round an integer to a fixed precision', t => {
  t.is(toFixed(123456, -3), 123000)
})

test('it can round a float to an integer', t => {
  t.is(toFixed(Math.PI), 3)
})
