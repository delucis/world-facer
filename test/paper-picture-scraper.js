import ava from 'ava'
import ninos from 'ninos'
import ps from '../lib/paper-scraper'
import pps from '../lib/paper-picture-scraper'

const test = ninos(ava)

test.before('make sure some undownloaded pictures are available', async t => {
  await ps({ n: 10, recurse: true, maxRecurse: 1 })
})

test.beforeEach('suppress console logging', t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
})

test('it downloads some images', async t => {
  const urls = await pps({ batchSize: 5 })
  t.true(urls.downloaded.length > 0)
})

test('it can recurse', async t => {
  const urls = await pps({ batchSize: 5, recurse: true, maxRecurse: 8 })
  t.true(urls.downloaded.length > 0)
})
