import test from 'ava'
import { getIterator } from '../lib/lang'

function setup (iterable = [1, 2, 3, 4, 5]) {
  return {
    iterable,
    iterator: getIterator(iterable)
  }
}

test('It should throw a non-iterable argument', t => {
  t.throws(() => { getIterator(567) })
  t.throws(() => { getIterator({ key: 'val' }) })
})

test('It should let you call .next()', t => {
  const { iterable, iterator } = setup()
  t.is(iterator.next().value, iterable[0])
  t.is(iterator.next().value, iterable[1])
})

test('It should also be iterable', t => {
  const { iterable, iterator } = setup()
  t.deepEqual(iterable, [...iterator])
})
