import ava from 'ava'
import ninos from 'ninos'
import ps from '../lib/paper-scraper'
import pw from '../lib/paper-words'
import CACHE from '../lib/cache-utils'

const test = ninos(ava)

const TO = (t = 10) => new Promise((resolve, reject) => setTimeout(resolve, t))

test.beforeEach('suppress console logging', t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
})

test.serial('It returns a string that is very long', async t => {
  const s = t.context.spy(CACHE, 'newCache', d => s.original(d, { maxAge: 500 }))
  await ps({ n: 3 })
  const words = await pw()
  t.is(typeof words, 'string')
})

test.serial('It will update its cache when it has expired', async t => {
  const size = (await pw.data()).length
  await ps({ n: 1 })
  await TO(500)
  t.true((await pw.data()).length > size)
})

test('It can return a string of titles', async t => {
  const titles = await pw.titles()
  t.is(typeof titles, 'string')
})

test('It returns a string of authors', async t => {
  const authors = await pw.authors()
  t.is(typeof authors, 'string')
})
