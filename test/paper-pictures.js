import ava from 'ava'
import ninos from 'ninos'
import pp from '../lib/paper-pictures'

const test = ninos(ava)

test.beforeEach('suppress console logging', t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
})

test('it downloads some images', async t => {
  let urls = await pp({ batchSize: 400 })
  t.true(urls.downloaded.length > 0)
})

test('it can recurse', async t => {
  let urls = await pp({ batchSize: 50, recurse: true, maxRecurse: 8 })
  t.true(urls.downloaded.length > 0)
})
