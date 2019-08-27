import test from 'ava'
import Err from '../lib/custom-error'

test('it returns a custom error', t => {
  const n = 'CustomError'
  const m = 'my custom error looks broken'
  const e = new Err(n, m)
  t.is(e.name, n)
  t.is(e.message, m)
})
