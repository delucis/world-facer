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

test('can be reset when done', t => {
  const size = 50
  const urn = new URN(size)
  const values = new Set()
  for (let i = 0; i < size; i++) {
    const val = urn.next()
    values.add(val)
    t.is(typeof val, 'number')
    t.is(urn.done, false)
  }
  let val = urn.next()
  t.is(val, undefined)
  t.is(urn.done, true)
  urn.reset()
  val = urn.next()
  t.is(typeof val, 'number')
  t.is(urn.done, false)
  t.true(values.has(val))
})

test('can be asked to reset automatically when done', t => {
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

test('can return different order after reset when unseeded', t => {
  const size = 20
  const urn = new URN(size, { autoReset: true })
  const values = []
  for (let i = 0; i < size; i++) {
    values.push(urn.next())
  }
  t.is(values.length, size)
  const values2 = []
  for (let i = 0; i < size; i++) {
    values2.push(urn.next())
  }
  t.is(values2.length, size)
  t.notDeepEqual(values, values2)
})

test('can be seeded for deterministic output', t => {
  const size = 20
  const urn = new URN(size, { seed: 1, autoReset: true })
  const values = []
  for (let i = 0; i < size; i++) {
    values.push(urn.next())
  }
  t.is(values.length, size)
  const values2 = []
  for (let i = 0; i < size; i++) {
    values2.push(urn.next())
  }
  t.is(values2.length, size)
  t.deepEqual(values, values2)
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
