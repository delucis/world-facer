const VLDT = require('@delucis/aproba')
const PATH = require('path')
const { createWriteStream, createReadStream } = require('fs')
const MKDIR = require('make-dir')
const BIG_JSON = require('big-json')
const COMPARE = require('resemblejs/compareImages')
const GG = require('gauge')
const ORA = require('ora')
const DT_FORMAT = require('date-fns/format')
const MS = require('pretty-ms')
const PP = require('../paper-pictures')

class SimilarityFollower {
  constructor (sm, { start = 0, maxNodes = Infinity } = {}) {
    this.sm = sm
    this.maxNodes = Math.min(maxNodes, sm.matrix.length)
    this.visited = new Set()
    this.follow(start)
  }

  follow (index) {
    this.visited.add(index)
    const similar = this.sm.getSimilar(index).filter(el => !this.visited.has(el))
    if (!similar.length || this.visited.size >= this.maxNodes) {
      return this.visited
    }
    this.follow(similar[0])
  }
}

/**
 * Get a similarity metric for two image buffers using Resemble.js
 * @param  {Buffer} buf1 Image buffer 1
 * @param  {Buffer} buf2 Image buffer 2
 * @return {Number}      Similarity measurement (0–1)
 */
async function getSimilarity (buf1, buf2) {
  VLDT('OO', arguments)
  const diff = await COMPARE(
    buf1, buf2,
    { ignore: 'antialiasing', largeImageThreshold: 32 }
  )
  return 1 - diff.rawMisMatchPercentage / 100
}

/**
 * Class containing a matrix of image similarity values
 */
class SimilarityMatrix {
  /**
   * Create a similarity matrix
   */
  constructor () {
    this.keys = []
    this.matrix = []
    this.hasBuilt = false
  }

  /**
   * Add a single image object to the similarity matrix
   * @param  {String}   dir    Directory the image is saved to (used as key)
   * @param  {Function} thumb  Function that returns an image thumbnail buffer
   * @param  {Object}   gauge  Optional gauge to update with progress
   * @return {Promise}         Resolves once done
   */
  async addImage ({ dir, thumb }, gauge) {
    VLDT('O|OO', arguments)
    VLDT('SF', [dir, thumb])
    let done = 0
    if (this.keys.includes(dir)) return
    const newRow = await Promise.all(this.matrix.map(async (row, idx) => {
      const comparisonImage = await this.getImage(idx)
      const similarity = await this.getSimilarity({dir, thumb}, comparisonImage)
      row.push(similarity)
      done++
      if (gauge) gauge.pulse((done / this.matrix.length * 100).toFixed(2) + '%')
      return similarity
    }))
    newRow.push(1)
    this.keys.push(dir)
    this.matrix.push(newRow)
    if (gauge) gauge.pulse()
  }

  /**
   * Populate the similarity matrix with paper-pictures data
   * @return {Promise} Resolves once all images have been compared
   */
  async build ({
    offset = 0,
    batchSize = 50,
    recurse = false,
    maxRecurse = Infinity,
    isRecursion = false,
    backupAfterEachBatch = false,
    backupAfterOffset = 0,
    gauge,
    startTime
  } = {}) {
    gauge = gauge || new GG()
    startTime = startTime || Date.now()

    const pictures = await PP()
    const images = pictures.slice(offset, offset + batchSize)

    const calcsForN = n => n * (n + 1) / 2

    const gaugeUpdate = done => {
      const todo = pictures.length
      const percentDone = calcsForN(done) / calcsForN(todo)
      const timeRemaining = done ? MS(
        (Date.now() - startTime) / percentDone * (1 - percentDone),
        { compact: true }
      ) : '???'
      gauge.show(
        `Comparing image ${done}/${todo} (ETA: ${timeRemaining})`,
        percentDone
      )
    }

    gaugeUpdate(offset)
    for (let i = 0; i < images.length; i++) {
      await this.addImage(images[i], gauge)
      gaugeUpdate(i + offset + 1)
    }

    if (backupAfterEachBatch && offset >= backupAfterOffset) {
      gauge.hide()
      const size = this.keys.length
      const dateString = DT_FORMAT(new Date(), 'YYYYMMDD-HHmmss')
      await this.write(`data/similarity-matrix/${dateString}-size[${size}].json`)
      gauge.show()
    }

    if (recurse && maxRecurse > 1 && pictures.length > offset) {
      await this.build({
        offset: offset + batchSize,
        maxRecurse: maxRecurse - 1,
        isRecursion: true,
        batchSize,
        recurse,
        backupAfterEachBatch,
        backupAfterOffset,
        gauge,
        startTime
      })
    }

    if (!isRecursion) {
      this.hasBuilt = true
      gauge.hide()
      await this.write('data/similarity-matrix/00000000-latest.json')
    }
  }

  /**
   * Get the similarity for two image objects
   * @param  {String}   dir    An image object’s dir property
   * @param  {Function} thumb  An image object’s thumb method (returns Buffer)
   * @param  {String}   dir    An image object’s dir property
   * @param  {Function} thumb  An image object’s thumb method (returns Buffer)
   * @return {Promise<Number>} A similarity metric, 0–1
   */
  async getSimilarity ({ dir: k1, thumb: t1 }, { dir: k2, thumb: t2 }) {
    VLDT('OO', arguments)
    VLDT('SFSF', [k1, t1, k2, t2])
    const [idx1, idx2] = [k1, k2].map(k => this.keyToIndex(k))
    const [row1, row2] = [idx1, idx2].map(i => this.matrix[i])
    if (
      idx1 < 0 || idx2 < 0 || row1.length < idx2 + 1 || row2.length < idx1 + 1
    ) {
      return getSimilarity(await t1(), await t2())
    }
    return this.matrix[idx1][idx2]
  }

  /**
   * Look up an image key from its numerical index
   * @param  {Number} idx Array index
   * @return {String}     Key
   */
  indexToKey (idx) {
    VLDT('N', arguments)
    return this.keys[idx]
  }

  /**
   * Get a numerical array index for a given key
   * @param  {String} key Key to look up
   * @return {Number}     Index
   */
  keyToIndex (key) {
    VLDT('S', arguments)
    return this.keys.indexOf(key)
  }

  /**
   * Get an array of indexes similar to the image at index
   * @param  {Number}  index               Index to find similar images for
   * @param  {Number}  [max=5]             Maximum matches to return
   * @param  {Number}  [threshold=0.6]     Minimum similarity to include (0–1)
   * @param  {Boolean} [includeSelf=false] Should index be included in matches
   * @return {Number[]}                    Array of indexes for similar images
   */
  getSimilar (index, { max = 5, threshold = 0.6, includeSelf = false } = {}) {
    VLDT('N|NO', arguments)
    VLDT('NNB', [max, threshold, includeSelf])
    return this.matrix[index]
      .map((val, idx) => [val, idx])
      .filter(
        ([val, idx]) => val >= threshold && (includeSelf || idx !== index)
      )
      .sort((a, b) => b[0] - a[0])
      .slice(0, max)
      .map(([val, idx]) => idx)
  }

  follower ({ start = 0, maxNodes = Infinity } = {}) {
    return new SimilarityFollower(this, { start, maxNodes })
  }

  /**
   * Fetch the full image object for an index from paper-pictures
   * @param  {Number} index     Index to get image for
   * @return {Promise<Object>}  Image object
   */
  async getImage (index) {
    VLDT('N', arguments)
    return PP.getImage(this.indexToKey(index))
  }

  /**
   * Serialise the similarity matrix and write it to disk
   * @param  {String}  [path='similarity-matrix.json'] Path to write to
   * @return {Promise} Resolves once finished writing
   */
  write (path = 'similarity-matrix.json') {
    VLDT('|S', arguments)
    const writeTask = new Promise(async (resolve, reject) => {
      const dir = PATH.dirname(path)
      if (dir) await MKDIR(dir)
      BIG_JSON.createStringifyStream({
        body: {
          keys: this.keys,
          matrix: this.matrix
        }
      }).pipe(createWriteStream(path))
        .on('error', reject)
        .on('finish', resolve)
    })
    ORA.promise(writeTask, `Writing matrix to disk after ${this.keys.length} images`)
    return writeTask
  }

  /**
   * Load a serialised similarity matrix from disk
   * @param  {String} [path='data/similarity-matrix/00000000-latest.json'] File to load
   * @return {Promise} Resolves once loaded
   */
  load (path = 'data/similarity-matrix/00000000-latest.json') {
    VLDT('|S', arguments)
    const sm = this
    const readTask = new Promise(function (resolve, reject) {
      createReadStream(path)
        .pipe(BIG_JSON.createParseStream())
        .on('data', data => {
          sm.keys = data.keys
          sm.matrix = data.matrix
          sm.hasBuilt = true
          resolve()
        })
        .on('error', reject)
    })
    ORA.promise(readTask, `Reading ${path}`)
    return readTask
  }
}

module.exports = SimilarityMatrix
