import test from 'ava'
import Err from '../lib/custom-error'

test('it returns a custom error', t => {
  let n = 'CustomError'
  let m = 'my custom error looks broken'
  let e = new Err(n, m)
  t.is(e.name, n)
  t.is(e.message, m)
})
