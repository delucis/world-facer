const MS = require('pretty-ms')
const PS = require('../paper-scraper')
const PPS = require('../paper-picture-scraper')
const C = require('../console')

async function bootstrap () {
  const startTime = Date.now()
  try {
    await PS({ recurse: true, n: 15 })
    await PPS({ recurse: true, batchSize: 100 })
    const duration = MS(Date.now() - startTime)
    C.log(`Done bootstrapping in ${duration} 👍`)
  } catch (e) {
    C.err('Bootstrap failed:', e)
    process.exitCode = 1
  }
}

bootstrap()
