import ava from 'ava'
import ninos from 'ninos'
import ps from '../lib/paper-scraper'
import pw from '../lib/paper-words'

const test = ninos(ava)

test.serial('It returns a string that is very long', async t => {
  console.log = t.context.stub()
  console.error = t.context.stub()
  await ps({ n: 3 })
  const words = await pw()
  t.is(typeof words, 'string')
})
