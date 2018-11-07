const MS = require('pretty-ms')
const PS = require('../lib/paper-scraper')
const PPS = require('../lib/paper-picture-scraper')
const PT = require('../lib/paper-thumbs')
const C = require('../lib/console')

async function bootstrap () {
  const startTime = Date.now()
  try {
    await PS({ n: 15 })
    await PPS({ recurse: true, batchSize: 100 })
    await PT()
    const duration = MS(Date.now() - startTime)
    C.log(`Done bootstrapping in ${duration} 👍`)
  } catch (e) {
    C.err('Bootstrap failed:', e)
    process.exitCode = 1
  }
}

bootstrap()
