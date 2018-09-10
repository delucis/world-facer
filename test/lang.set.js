import test from 'ava'
import l from '../lib/lang'

test('it can convert a set to an array', t => {
  const s = new Set([0, 500, 1, 1000])
  const res = l.set.toArr(s)
  t.true(Array.isArray(res))
  t.is(res.length, 4)
  t.deepEqual(res, [0, 500, 1, 1000])
})

test('it can concatenate sets, arrays, and maps', t => {
  const s = new Set(['one', 'two'])
  const s2 = new Set(['two', 'three'])
  const a = ['three', 'four']
  const m = new Map([a])
  const res = l.set.concat(s, s2, a, m)
  t.is(res.size, 5)
  t.true(
    res.has('one') &&
    res.has('two') &&
    res.has('three') &&
    res.has('four')
  )
  t.deepEqual(...(l.set.slice(res, 4)), a)
})

test('it can filter a set', t => {
  const s = new Set([0, 500, 1, 1000])
  const res = l.set.filter(s, v => v > 750)
  t.is(res.size, 1)
  t.true(res.has(1000))
})

test('it can map a set', t => {
  const s = new Set([500, 1000])
  const res = l.set.map(s, v => v * 2)
  t.is(res.size, s.size)
  t.true(res.has(1000) && res.has(2000))
})

test('it can slice a set', t => {
  const s = new Set([0, 500, 1, 1000])
  const res = l.set.slice(s, 2)
  t.is(res.size, 2)
  t.true(res.has(1) && res.has(1000))
})
