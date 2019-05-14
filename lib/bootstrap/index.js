const MS = require('pretty-ms')
const PS = require('../paper-scraper')
const PPS = require('../paper-picture-scraper')
const PT = require('../paper-thumbs')
const SM = require('../similarity-matrix')
const C = require('../console')

async function buildSimilarityMatrix () {
  const sm = new SM()
  try {
    await sm.load()
  } catch (_) {}
  await sm.build({ recurse: true })
}

async function bootstrap () {
  const startTime = Date.now()
  try {
    await PS({ recurse: true, n: 15 })
    await PPS({ recurse: true, batchSize: 1 })
    await PT()
    await buildSimilarityMatrix()
    const duration = MS(Date.now() - startTime)
    C.log(`Done bootstrapping in ${duration} 👍`)
  } catch (e) {
    C.err('Bootstrap failed:', e)
    process.exitCode = 1
  }
}

bootstrap()
