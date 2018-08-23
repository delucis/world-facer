import test from 'ava'
import scrape from '../lib/paper-scraper'

test.serial('It returns an object', async t => {
  const r = await scrape({ n: 3 })
  t.is(typeof r, 'object')
})

test.serial('It can recurse', async t => {
  const r = await scrape({ n: 3, recurse: true, maxRecurse: 1 })
  t.is(typeof r, 'object')
})
