import ava from 'ava'
import ninos from 'ninos'
import scrape from '../lib/paper-scraper'

const test = ninos(ava)

test.beforeEach('suppress console logging', t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
})

test.serial('It returns an object', async t => {
  const r = await scrape({ n: 3 })
  t.is(typeof r, 'object')
})

test.serial('It can recurse', async t => {
  const r = await scrape({ n: 3, recurse: true, maxRecurse: 1 })
  t.is(typeof r, 'object')
})
