const VLDT = require('@delucis/aproba')
const compare = require('resemblejs/compareImages')
const fs = require('fs').promises
const GG = require('gauge')
const format = require('date-fns/format')
const PP = require('../paper-pictures')

/**
 * Get a similarity metric for two image buffers using Resemble.js
 * @param  {Buffer} buf1 Image buffer 1
 * @param  {Buffer} buf2 Image buffer 2
 * @return {Number}      Similarity measurement (0–1)
 */
async function getSimilarity (buf1, buf2) {
  VLDT('OO', arguments)
  const diff = await compare(
    buf1, buf2,
    { scaleToSameSize: true, ignore: 'antialiasing', largeImageThreshold: 256 }
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
    this.cache = {}
    this.keys = []
    this.matrix = []
    this.hasBuilt = false
  }

  /**
   * Add a single image object to the similarity matrix
   * @param  {String}   dir    Directory the image is saved to (used as key)
   * @param  {Function} buffer Function that returns an image buffer
   * @param  {Object}   gauge  Optional gauge to update with progress
   * @return {Promise}         Resolves once done
   */
  async addImage ({ dir, buffer }, gauge) {
    VLDT('O|OO', arguments)
    VLDT('SF', [dir, buffer])
    let done = 0
    if (this.cache.hasOwnProperty(dir)) return
    const newRow = await Promise.all(this.matrix.map(async (row, idx) => {
      const comparisonImage = await this.getImage(idx)
      const similarity = await this.getSimilarity({dir, buffer}, comparisonImage)
      row.push(similarity)
      done++
      if (gauge) gauge.pulse((done / this.matrix.length * 100).toFixed(2) + '%')
      return similarity
    }))
    newRow.push(1)
    this.keys.push(dir)
    this.matrix.push(newRow)
  }

  /**
   * Populate the similarity matrix with paper-pictures data
   * @return {Promise} Resolves once all images have been compared
   */
  async build ({ offset = 0, batchSize = 50, recurse = false, maxRecurse = Infinity, gauge, backupAfterEachBatch = false }) {
    this.gauge = gauge || new GG()

    const images = (await PP()).slice(offset, batchSize)

    for (let i = 0; i < images.length; i++) {
      this.gauge.show(`Comparing images: ${i}/${images.length}`, i / images.length)
      await this.addImage(images[i], this.gauge)
      this.gauge.show(`Comparing images: ${i + 1}/${images.length}`, (i + 1) / images.length)
    }

    if (backupAfterEachBatch) {
      this.gauge.hide()
      const done = batchSize * (offset + 1)
      console.log(`Backing up results after ${done} images...`)
      await this.write(`similarity-matrix-${format(new Date(), 'YYYYMMDD-HHmmss')}-size[${this.keys.length}].json`)
      this.gauge.show()
    }

    if (recurse && maxRecurse > 1 && images.length > offset) {
      this.build({ offset: offset + batchSize, batchSize, recurse, maxRecurse: maxRecurse - 1, gauge })
    }

    this.hasBuilt = true
    if (!gauge) {
      this.gauge.hide()
      delete this.gauge
    }
  }

  /**
   * Get the similarity for two image objects
   * @param  {String}   dir    An image object’s dir property
   * @param  {Function} buffer An image object’s buffer method (returns Buffer)
   * @param  {String}   dir    An image object’s dir property
   * @param  {Function} buffer An image object’s buffer method (returns Buffer)
   * @return {Promise<Number>} A similarity metric, 0–1
   */
  async getSimilarity ({ dir: k1, buffer: b1 }, { dir: k2, buffer: b2 }) {
    VLDT('OO', arguments)
    VLDT('SFSF', [k1, b1, k2, b2])
    if (!this.cache[k1] || !this.cache[k1][k2]) {
      const diff = await getSimilarity(await b1(), await b2())
      if (!this.cache[k1]) this.cache[k1] = {}
      if (!this.cache[k2]) this.cache[k2] = {}
      this.cache[k1][k2] = this.cache[k2][k1] = diff
    }
    return this.cache[k1][k2]
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
  async write (path = 'similarity-matrix.json') {
    VLDT('|S', arguments)
    return fs.writeFile(path, JSON.stringify({
      keys: this.keys,
      matrix: this.matrix
    }))
  }

  /**
   * Load a serialised similarity matrix from disk
   * @param  {String}  [path='similarity-matrix.json'] Path of file to load
   * @return {Promise}                                 Resolves once loaded
   */
  async load (path = 'similarity-matrix.json') {
    VLDT('|S', arguments)
    const data = JSON.parse(await fs.readFile(path, 'utf8'))
    this.keys = data.keys
    this.matrix = data.matrix
    this.cache = {}
    this.keys.forEach((k1, idx) => {
      this.cache[k1] = {}
      const row = this.matrix[idx]
      this.keys.forEach((k2, col) => { this.cache[k1][k2] = row[col] })
    })
    this.hasBuilt = true
  }
}

module.exports = SimilarityMatrix
