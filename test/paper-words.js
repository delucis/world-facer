import ava from 'ava'
import ninos from 'ninos'
import ps from '../lib/paper-scraper'
import pw from '../lib/paper-words'
import CACHE from '../lib/cache-utils'

const test = ninos(ava)

const TO = (t = 10) => new Promise((resolve, reject) => setTimeout(resolve, t))

test.serial('It returns a string that is very long', async t => {
  console.log = t.context.stub()
  console.error = t.context.stub()
  const s = t.context.spy(CACHE, 'newCache', d => s.original(d, { maxAge: 500 }))
  await ps({ n: 3 })
  const words = await pw()
  t.is(typeof words, 'string')
})

test.serial('It will update its cache when it has expired', async t => {
  const size = (await pw.data()).length
  await ps({ n: 1 })
  await TO(500)
  t.is((await pw.data()).length, size + 1)
})
