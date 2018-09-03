const FS = require('fs')
const PATH = require('path')
const UTIL = require('util')
const MKDIR = require('make-dir')
const VLDT = require('aproba')
const GG = require('gauge')
const MS = require('pretty-ms')
const IP = require('instapaper')
const GET = require('request-promise-native')
const C = require('../console')
// Load environment variables from .env file
require('dotenv').config()

const ACCESS = UTIL.promisify(FS.access)
const WRITE = UTIL.promisify(FS.writeFile)

/**
 * Run a data scraping sequence to gather text from Instapaper bookmarks
 * @param  {Number}  [n=10]               Number of bookmarks per batch
 * @param  {Boolean} [recurse=false]      Should the function recurse
 * @param  {Number}  [maxRecurse=Infinity] How deep can the recursion go?
 * @return {Object}                       bookmarks and failures from this run
 */
module.exports = async function paperScraper ({ n = 10, recurse = false, maxRecurse = Infinity } = {}) {
  VLDT('NBN', [n, recurse, maxRecurse])
  this.client = this.client || CLIENT_INIT() // Instapaper API client
  this.bookmarks = this.bookmarks || {} // Storage for retrieved bookmarks
  this.failedIDs = this.failedIDs || {} // Storage for IDs that errored
  this.progressCache = this.progressCache || Infinity // Progress made last time
  this.startTime = this.startTime || Date.now() // When did we start scraping?
  this.recurseCount = typeof this.recurseCount === 'number' ? this.recurseCount + 1 : 0

  console.log()
  C.log(C.b(`Starting recursion #${this.recurseCount}`))

  // quickmarks are the bookmarks that were pre-gathered by
  // cs-reading-list and need text fetching for them
  this.quickmarks = this.quickmarks || await GET_BOOKMARKS()
  this.quickmarks = await FILTER_BOOKMARKS(this.quickmarks, dataDir)

  if (this.quickmarks.length === 0) {
    console.log('      No more bookmarks to retrieve, returning...')
    return { bookmarks: this.bookmarks, failures: this.failedIDs }
  }

  console.log(`      ${this.quickmarks.length} bookmarks left to retrieve.`)

  if (this.recurseCount) {
    const timeRemaining = GET_TIME_REMAINING(this, { recurse, n, maxRecurse })
    console.log(`      Estimated time remaining: ${timeRemaining}`)
  }

  console.log(`      Fetching full text for batch of ${n} bookmarks...`)

  const { bookmarks, failedIDs } = await GET_TEXT(this.quickmarks, n, this)

  Object.assign(this.bookmarks, bookmarks)
  Object.assign(this.failedIDs, failedIDs)

  // Make sure failed IDs are removed from the current task loop
  for (let id in failedIDs) {
    delete this.bookmarks[id]
    const i = this.quickmarks.findIndex(b => b.bookmark_id === id)
    if (i > -1) this.quickmarks.splice(i, 1)
  }

  // Save bookmark data to disk
  await WRITE_BOOKMARKS(bookmarks, dataDir)

  // If more work is still to be done, recurse until it is done
  if (recurse && this.recurseCount < maxRecurse && this.quickmarks.length < this.progressCache) {
    this.progressCache = this.quickmarks.length
    await paperScraper({ n, recurse, maxRecurse })
  }

  return { bookmarks: this.bookmarks, failures: this.failedIDs }
}

/**
 * Estimate the duration left for this paper-scraper run
 * @param  {Object}   ps            paper scraper’s `this`
 * @param  {Number}   ps.startTime  Time this run started
 * @param  {Object}   ps.failedIDs  Bookmarks that have failed so far
 * @param  {Object}   ps.bookmarks  Bookmarks that have been retrieved so far
 * @param  {Object[]} ps.quickmarks Bookmarks still left to retrieve
 * @param  {Object}   o             Options object
 * @param  {Number}   o.n           How many bookmarks are fetched per recursion
 * @param  {Boolean}  o.recurse     Can this run recurse?
 * @param  {Number}   o.maxRecurse  What is the maximum recursion depth
 * @return {String}   Time remaining as a human-friendly string
 */
function GET_TIME_REMAINING (
  { startTime, failedIDs, bookmarks, quickmarks },
  { n, recurse, maxRecurse }
) {
  VLDT('NOOANBN', [ startTime, failedIDs, bookmarks, quickmarks, n, recurse, maxRecurse ])
  const timeElapsed = Date.now() - startTime
  const completed = Object.keys(failedIDs).length + Object.keys(bookmarks).length
  let remaining = quickmarks.length
  if (recurse && maxRecurse < Infinity) {
    remaining = maxRecurse * n < remaining ? maxRecurse * n : remaining
  }
  return MS(remaining * timeElapsed / completed, { secDecimalDigits: 0, compact: true })
}

/**
 * Filter a bookmarks array to remove those for which data is already saved
 * @param  {Object[]} bookmarks Array of bookmark objcts
 * @param  {String}   dir       Directory where data to check for is saved
 * @return {Promise<Array>}     Filtered array of bookmark objects
 */
async function FILTER_BOOKMARKS (bookmarks, dir) {
  VLDT('AS', [bookmarks, dir])
  let discards = 0
  bookmarks = await Promise.all(bookmarks.map(async b => {
    try {
      await ACCESS(PATH.join(dir, b.bookmark_id.toString(), 'index.json'))
      discards++
      return
    } catch (e) {
      return b
    }
  }))
  console.log(`      Discarded ${discards} bookmark${discards === 1 ? '' : 's'} that had already been retrieved`)
  return bookmarks.filter(b => b !== undefined)
}

/**
 * Save bookmark data to disk as JSON and full text additionally as HTML files
 * @param  {Object[]} bookmarks Array of bookmark objects
 * @param  {String}   dir       Directory to save data to
 * @return {Promise<Array>}     Returns when writing is complete
 */
async function WRITE_BOOKMARKS (bookmarks, dir) {
  VLDT('OS', [bookmarks, dir])
  if (Object.keys(bookmarks).length === 0) return
  C.log('Writing bookmarks to disk...')
  return Promise.all(Object.keys(bookmarks).map(async id => {
    const b = bookmarks[id]
    await MKDIR(PATH.join(dir, id.toString()))
    const json = JSON.stringify(b, null, 2)
    await Promise.all([
      WRITE(PATH.join(dir, id.toString(), 'index.json'), json),
      WRITE(PATH.join(dir, id.toString(), 'index.html'), b.text)
    ])
  }))
}

/**
 * Initialise Instapaper API client with credentials
 * @return {Object} Instapaper API client instance
 */
function CLIENT_INIT () {
  C.log('Initialising Instapaper client...')
  const client = IP(process.env.INSTAPAPER_API_KEY, process.env.INSTAPAPER_API_SECRET)
  return client.setUserCredentials(process.env.INSTAPAPER_LOGIN_KEY, process.env.INSTAPAPER_LOGIN_SECRET)
}

/**
 * Get bookmarks already collected by cs-reading-list project
 * @return {Array} Instapaper bookmarks
 */
async function GET_BOOKMARKS () {
  C.log('Fetching JSON from data muncher...')
  let json = await GET({
    uri: 'https://cs-reading-list-data-muncher.netlify.com/data.json',
    json: true
  })
  return json.instapaper.bookmarks
}

/**
 * Get full text for an array of Instapaper bookmarks
 * @param  {Object[]} quickmarks Bookmarks to fetch full text for
 * @param  {Number}   n          Number of bookmarks to fetch in one batch
 * @param  {Object}   ctx        Context (this) of caller
 * @return {Object}              Object containing bookmarks and failed IDs
 */
async function GET_TEXT (quickmarks, n, ctx) {
  VLDT('ANO', [quickmarks, n, ctx])

  const gauge = new GG()
  let progress = 0
  const updateGauge = msg => {
    progress += 1 / n
    gauge.show(`${msg} (${Math.round(progress * n)}/${n})`, progress)
  }
  gauge.show(`Fetching bookmark text (0/${n})`, progress)

  const bookmarks = {}
  const doneids = []
  const errors = []
  const failedIDs = {}

  for (const b of quickmarks.slice(-1 * n)) {
    const id = b.bookmark_id
    bookmarks[id] = b
    bookmarks[id].cacheTime = Date.now()
    try {
      const text = await ctx.client.bookmarks.getText(id)
      if (!text) throw new TypeError('No text returned')
      if (text.length < 500) throw new RangeError('Text returned is too short')
      bookmarks[id].text = text
      bookmarks[id].cacheTime = Date.now()
      delete failedIDs[id]
      doneids.push(id)
      updateGauge(`Got text for ${id}`)
    } catch (e) {
      delete bookmarks[id]
      failedIDs[id] = b
      errors.push(e)
      updateGauge(`Errored for ${id}`)
    }
  }

  gauge.hide()
  LOG_GET_TEXT_ERRORS(errors)
  LOG_GET_TEXT_COMPLETION(doneids)

  return { bookmarks, failedIDs }
}

/**
 * Log errors while getting full text in a concise and clear way
 * @param {Error[]} errors Array of error objects thrown during GET_TEXT()
 */
function LOG_GET_TEXT_ERRORS (errors) {
  VLDT('A', [errors])

  if (errors.length > 0) {
    let types = errors.reduce((types, e) => {
      types[e.name] = types[e.name] ? types[e.name] + 1 : 1
      return types
    }, {})
    types = Object.entries(types)
      .map(([type, count]) => `${type} ×${count}`)
      .join(', ')
    C.err(
      `Encountered ${errors.length} error${errors.length === 1 ? '' : 's'}`,
      `Error types: ${types}`
    )
  }
}

/**
 * Log successful GET_TEXT results in a concise and clear way
 * @param {String[]} doneids IDs of bookmarks successfully retrieved
 */
function LOG_GET_TEXT_COMPLETION (doneids) {
  VLDT('A', [doneids])

  const doneidsLines = doneids
    .reduce((groups, id, i) => {
      let groupIndex = Math.floor(i / 7)
      if (!groups[groupIndex]) groups[groupIndex] = []
      groups[groupIndex].push(id)
      return groups
    }, [])
    .map(group => group.join(', '))

  C.log(`Got full text for ${doneids.length} IDs`, ...doneidsLines)
}
