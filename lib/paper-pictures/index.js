const FS = require('fs').promises
const PATH = require('path')
const VLDT = require('@delucis/aproba')
const IS_URL = require('is-url-superb')
const GET = require('request')
const TYPE = require('image-type')
const SLUG = require('slugg')
const MKDIR = require('make-dir')
const GG = require('gauge')
const MS = require('pretty-ms')
const WORDS = require('../paper-words')
const C = require('../console')
const E = require('../custom-error')
const CACHE = require('../cache-utils')
const SU = require('../string-utils')

/**
 * Execute full paper-pictures scraping loop:
 * - extract image URLs from full text returned from Instapaper API
 * - exclude any URLs already downloaded on disk
 * - download and write to disk remaining image URLs
 * @param {Object}  [o]             Options
 * @param {Number}  [o.batchSize]   Images to fetch per recursion
 * @param {Boolean} [o.recurse]     Should paperPictures recurse?
 * @param {Number}  [o.maxRecurse]  How many recursions are allowed?
 */
module.exports = async function paperPictures ({ batchSize, recurse, maxRecurse } = {}) {
  VLDT('N', [batchSize])
  C.l()
  C.log(C.b('Starting paper-pictures image scraper'))

  C.l('Extracting image URLs from Instapaper full text...')
  let urls = await GET_PAPER_IMG_URLS()
  C.l(`Extracted ${urls.length} URLs`)

  urls = await FILTER_URLS(urls, { batchSize })

  C.l(`${urls.length} images still to download`)
  return DOWNLOAD_IMAGES.call({}, urls, { batchSize, recurse, maxRecurse })
}

/**
 * Get all the src URLs from <img> tags in html string
 * @param  {String} html HTML string to extract URLs from
 * @return {String[]}    Array of URLs
 */
const EXTRACT_IMG_SRC = html => {
  VLDT('S', [html])
  const imgSrc = /<img.*?src="(.*?)".*?>/gi
  const srcs = []
  let result
  while ((result = imgSrc.exec(html)) !== null) {
    if (result[1] && IS_URL(result[1])) srcs.push(result[1])
  }
  return srcs
}

/**
 * Get all the image URLs from Instapaper bookmarks
 * @return {Promise<String[]>} Array of URL strings
 */
const GET_PAPER_IMG_URLS = async () => {
  if (this.cache && !this.cache.hasExpired()) return this.cache.get()

  const urls = [...(await WORDS.data()).reduce((urls, bookmark) => {
    if (!bookmark.text) return urls
    const srcs = EXTRACT_IMG_SRC(bookmark.text)
    srcs.forEach(src => urls.add(src))
    return urls
  }, new Set())]

  if (this.cache) {
    this.cache.update(urls)
  } else {
    this.cache = CACHE.newCache(urls, { maxAge: 300000 })
  }
  return this.cache.get()
}

/**
 * Get an image’s directory name from its URL
 * @param   {String}  url The URL to convert to a directory name
 * @return  {String}      The formatted directory name
 */
const GET_DIRNAME = url => SU.collapse(
  SLUG(url),
  { length: 160, separator: '-----' }
)

/**
 * Discard URLs if we already have a matching image on disk
 * @param  {String[]}  urls Array of URLs for images to fetch
 * @return {Promise<String[]>} Filtered array of URLs
 */
const FILTER_URLS = async urls => {
  VLDT('A', [urls])
  const imageDir = PATH.resolve(__dirname, '../../data/paper-pictures')
  let files
  try {
    files = await FS.readdir(imageDir)
  } catch (e) {
    return urls
  }
  const filenames = new Set(files.map(f => PATH.parse(f).name))
  const filteredUrls = urls.filter(url => !filenames.has(GET_DIRNAME(url)))
  const discards = urls.length - filteredUrls.length
  C.l(`Discarded ${discards} URL${discards === 1 ? '' : 's'} that have already been retrieved`)
  return filteredUrls
}

/**
 * Try to download and write to disk an image from its URL
 * @param  {String}  url   Image URL
 * @param  {Object}  gauge Gauge instance to update on data progress
 * @return {Promise}       Resolves once image has finished writing
 */
const DOWNLOAD_IMAGE = async (url, gauge) => {
  VLDT('SO', [url, gauge])
  const ppDir = PATH.resolve(__dirname, '../../data/paper-pictures')
  const get = GET.defaults({
    headers: { 'User-Agent': 'world-facer/paper-pictures' },
    timeout: 20000
  })

  return new Promise(async function (resolve, reject) {
    get.head(url, (e, r) => {
      if (e) {
        e.code = e.code === 'ETIMEDOUT' ? e.connect ? 'ConnectTimeout' : 'ReadTimeout' : e.code
        e.name = `${e.name} (${e.code})`
        reject(e)
        return
      }
      if (!r.headers) {
        reject(new E('NoHeaders', 'Response did not include any headers'))
        return
      }
      if (!r.headers['content-type']) {
        reject(new E('NoContentType', 'Response did not include Content-Type'))
        return
      }
      if (r.headers['content-type'].startsWith('text')) {
        const type = r.headers['content-type']
        reject(new E('NonImageContent', `Content-Type “${type}” not valid`))
        return
      }

      const image = []

      get(url, e => {
        if (e) {
          e.code = e.code === 'ETIMEDOUT' ? e.connect ? 'ConnectTimeout' : 'ReadTimeout' : e.code
          e.name = `${e.name} (${e.code})`
          reject(e)
        }
      })
        .on('error', e => reject(e))
        .on('data', chunk => {
          gauge.pulse()
          image.push(chunk)
        })
        .on('end', async () => {
          if (!image.length) {
            reject(new E('NoData', 'Got no image data :-/'))
            return
          }
          const type = TYPE(image[0])
          if (!type) {
            reject(new E('ImageTypeError', 'Couldn’t parse image'))
            return
          }
          const data = Buffer.concat(image)
          const imgDir = GET_DIRNAME(url)
          await MKDIR(PATH.join(ppDir, imgDir))
          await FS.writeFile(PATH.join(ppDir, imgDir, `img.${type.ext}`), data)
            .catch(e => reject(e))
          resolve()
        })
    })
  })
}

/**
 * Asynchronously loop through promises, limiting the number of parallel calls
 * @param  {Function[]}  functions  An array of async functions to loop through
 * @param  {Number}      [limit=15] The maximum number of parallel calls
 * @return {Promise<Array>}         Array of values returned by functions
 */
const THROTTLED_LOOP = async (functions, limit = 15) => {
  VLDT('AN', [functions, limit])
  const pending = new Set()

  return Promise.all(functions.map(async fn => {
    while (pending.size >= limit) await Promise.race(pending)

    const promise = fn()
    pending.add(promise)
    await promise
    pending.delete(promise)
    return promise
  }))
}

/**
 * Summarise errors received while downloading images
 * @param {Error[]} errors Array of error objects
 */
const SUMMARISE_ERRORS = errors => {
  VLDT('A', [errors])

  if (errors.length > 0) {
    let types = errors.reduce((types, e) => {
      types[e.name] = types[e.name] ? types[e.name] + 1 : 1
      return types
    }, {})
    types = Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => `  - ${type} ×${count}`)
    C.err(
      `Encountered ${errors.length} error${errors.length === 1 ? '' : 's'}`,
      `Error types:`,
      ...types
    )
  }
}

/**
 * Download and save images from an array of URLs
 * @param {String[]}  urls                    Array of image URLs
 * @param {Object}    [o]                     Options
 * @param {Number}    [o.batchSize=15]        Downloads per recursion
 * @param {Boolean}   [o.recurse=false]       Should paperPictures recurse?
 * @param {Number}    [o.maxRecurse=Infinity] How many recursions are allowed?
 */
async function DOWNLOAD_IMAGES (
  urls, { batchSize = 15, recurse = false, maxRecurse = Infinity } = {}
) {
  VLDT('ANBN', [urls, batchSize, recurse, maxRecurse])

  this.startTime = this.startTime || Date.now()
  this.urls = this.urls || urls
  this.recurseCount = this.recurseCount ? this.recurseCount + 1 : 1
  this.gauge = this.gauge || new GG()
  this.done = this.done || 0
  this.errors = this.errors || []
  this.downloadedUrls = this.downloadedUrls || []
  this.failedUrls = this.failedUrls || []
  this.maxRecursionSize = this.maxRecursionSize || maxRecurse * batchSize
  this.recursesAll = this.recursesAll || this.maxRecursionSize > urls.length
  this.n = this.n || recurse ? this.recursesAll ? this.urls.length : this.maxRecursionSize : batchSize

  if (!this.updateGauge) {
    this.updateGauge = function (i = 1, url, err) {
      VLDT('N|NS|NSE', arguments)

      this.done += i

      if (err) {
        this.failedUrls.push(url)
        this.errors.push(err)
      } else if (url) {
        this.downloadedUrls.push(url)
      }

      const remainingUrls = this.n - this.done
      let remainingTime
      if (this.done > 0) remainingTime = MS((Date.now() - this.startTime) / this.done * remainingUrls, { compact: true })

      this.gauge.pulse()
      this.gauge.show(
        'Downloading images: ' +
        this.downloadedUrls.length + ' ' + C.blue('✔︎') + ' / ' +
        this.failedUrls.length + ' ' + C.red('✘') + ' / ' +
        remainingUrls + ' remaining ' +
        '(ETA: ' + (remainingTime || '???') + ')',
        this.done / this.n
      )
    }
    this.updateGauge(0)
  }

  const recurseCount = this.recurseCount
  const batch = urls.slice(0, batchSize)
  const remaining = urls.slice(batchSize)

  await THROTTLED_LOOP(batch.map(url => async () => {
    try {
      await DOWNLOAD_IMAGE(url, this.gauge)
      this.updateGauge(1, url)
    } catch (e) {
      this.updateGauge(1, url, e)
    }
  }))

  if (recurse && this.recurseCount < maxRecurse && remaining.length > 0) {
    await DOWNLOAD_IMAGES.call(this, remaining, { batchSize, recurse, maxRecurse })
  }

  if (recurseCount === 1) {
    this.gauge.hide()
    SUMMARISE_ERRORS(this.errors)
    C.log(`Successfully downloaded ${this.done - this.errors.length} images`)
  }

  return { downloaded: this.downloadedUrls, failed: this.failedUrls }
}
