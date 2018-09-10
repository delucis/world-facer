import test from 'ava'
import { map } from '../lib/lang'

test('it can convert a map to an array', t => {
  const m = new Map([[0, 500], [1, 1000]])
  const res = map.toArr(m)
  t.true(Array.isArray(res))
  t.is(res.length, 2)
  t.deepEqual(res[1], [1, 1000])
})

test('it can concatenate maps and map-like arrays or sets', t => {
  const m = new Map([[0, 500], [1, 1000]])
  const m2 = new Map([[2, 2000]])
  const a = [[3, 4000]]
  const s = new Set([[4, 8000]])
  const res = map.concat(m, m2, a, s)
  t.is(res.size, 5)
  t.is(res.get(2), 2000)
  t.is(res.get(3), 4000)
  t.is(res.get(4), 8000)
})

test('it can filter a map', t => {
  const m = new Map([[0, 500], [1, 1000]])
  t.is(m.size, 2)
  t.true(m.has(0) && m.has(1))

  const res = map.filter(m, ([k, v]) => v > 750)
  t.is(res.size, 1)
  t.true(!res.has(0) && res.has(1))
})

test('it can map a map', t => {
  const m = new Map([[0, 500], [1, 1000]])
  const res = map.map(m, ([k, v]) => [k, v * 2])
  t.is(res.size, m.size)
  t.is(res.get(0), m.get(0) * 2)
  t.is(res.get(1), m.get(1) * 2)
})

test('it can slice a map', t => {
  const m = new Map([[0, 500], [1, 1000], ['2', '2000'], ['3', '4000']])
  const res = map.slice(m, 2)
  t.is(res.size, 2)
  t.true(res.has('2') && res.has('3'))
})
