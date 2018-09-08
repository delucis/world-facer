import test from 'ava'
import su from '../lib/string-utils'

test('it doesn’t collapse a string that’s not too long', t => {
  const s = 'autobuses'
  t.is(su.collapse(s), s)
})

test('it collapses a string', t => {
  t.is(su.collapse('awesome autobuses', { length: 5 }), 'a...s')
})

test('it collapses a string with a custom separator', t => {
  t.is(
    su.collapse('awesome autobuses', { length: 7, separator: '-----' }),
    'a-----s'
  )
})
