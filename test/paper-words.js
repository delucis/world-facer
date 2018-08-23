import test from 'ava'
import pw from '../lib/paper-words'

test('It returns a string that is very long', async t => {
  const words = await pw()
  t.is(typeof words, 'string')
})
