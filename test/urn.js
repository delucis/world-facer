import test from 'ava'
import URN from '../lib/urn'

test('can be called as many times as instantiated size', t => {
  const size = 50
  const urn = new URN(size)
  for (let i = 0; i < size; i++) {
    t.is(typeof urn.next(), 'number')
    t.is(urn.done, false)
  }
  t.is(urn.next(), undefined)
  t.is(urn.done, true)
})

test('does not repeat values', t => {
  const size = 100000
  const urn = new URN(size)
  const values = new Set()
  while (!urn.done) {
    const val = urn.next()
    if (typeof val === 'number') values.add(val)
  }
  t.is(values.size, size)
})

test('can return values from a passed array', t => {
  const arr = ['foo', 'bar', 'baz']
  const urn = new URN(arr)
  while (!urn.done) {
    const val = urn.next()
    if (val) t.true(arr.includes(val))
  }
})

test('can return values from a passed set', t => {
  const set = new Set(['three', 'little', 'figs'])
  const urn = new URN(set)
  while (!urn.done) {
    const val = urn.next()
    if (val) t.true(set.has(val))
  }
})

test('can be asked to reset when done', t => {
  const size = 50
  const urn = new URN(size, { autoReset: true })
  const values = new Set()
  for (let i = 0; i < size; i++) {
    const val = urn.next()
    values.add(val)
    t.is(typeof val, 'number')
    t.is(urn.done, false)
  }
  const val = urn.next()
  t.is(typeof val, 'number')
  t.is(urn.done, false)
  t.true(values.has(val))
})

test('throws if instantiated with size < 1', t => {
  t.throws(() => new URN(0))
  t.throws(() => new URN([]))
  t.throws(() => new URN(new Set()))
})

test('throws if passed a non-valid source', t => {
  t.throws(() => new URN('string'))
  t.throws(() => new URN(() => {}))
  t.throws(() => new URN({}))
  t.throws(() => new URN(true))
})
