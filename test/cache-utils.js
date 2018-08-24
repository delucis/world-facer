import test from 'ava'
import { hasExpired, newCache } from '../lib/cache-utils'

const TO = (t = 10) => new Promise((resolve, reject) => setTimeout(resolve, t))

test('Returns false if the cache hasn’t expired', t => {
  t.false(hasExpired(Date.now()))
})

test('Returns true if the cache has expired', t => {
  t.true(hasExpired(Date.now() - 300000))
})

test('Accepts custom cache expiry age', t => {
  t.true(hasExpired(Date.now() - 200, { maxAge: 100 }))
})

test('A cache instance can return the data it holds', t => {
  const data = 'A stringful of tasty words.'
  const cache = newCache(data)
  t.is(cache.get(), data)
})

test('A cache instance can be updated', async t => {
  t.plan(3)
  const cache = newCache('data')
  t.is(cache.get(), 'data')
  await TO(1000)
  const age = cache.getAge()
  cache.update('new data')
  t.is(cache.get(), 'new data')
  t.true(cache.getAge() < age)
})

test('A cache instance can let you know it has expired', async t => {
  t.plan(1)
  const cache = newCache('data', { maxAge: 500 })
  await TO(1000)
  t.true(cache.hasExpired())
})
