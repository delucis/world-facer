const FS = require('fs')
const PATH = require('path')
const UTIL = require('util')
const VLDT = require('@delucis/aproba')
const TRACKER = require('are-we-there-yet').TrackerGroup
const GG = require('gauge')
const CACHE = require('../cache-utils')

const READ = UTIL.promisify(FS.readFile)
const READ_DIR = UTIL.promisify(FS.readdir)
const STAT = UTIL.promisify(FS.stat)

module.exports = (function () {
  /**
   * Get paper-picture-scraper data from disk or, if already cached, from cache
   * @return {Object[]} Array of image data objects
   */
  async function GET_DATA () {
    if (!this.cache || this.cache.hasExpired()) {
      const tracker = new TRACKER('paper pictures')
      const progress = new GG()
      tracker.on('change', function (name, completed) {
        progress.show(name, completed)
        if (completed === 1) progress.hide()
      })
      const data = await LOAD_DATA(tracker)
      if (this.cache) {
        this.cache.update(data)
      } else {
        this.cache = CACHE.newCache(data, { maxAge: 300000 })
      }
      tracker.finish()
    }
    return this.cache.get()
  }

  /**
   * Gather all the data from paper-picture-scraper’s JSON output files
   * @param  {Object}   tracker An “are-we-there-yet” tracker instance
   * @return {Object[]}         An array of image data objects
   *
   * In addition to the data loaded from disk, this adds an imgPath property for
   * the full path to each image on disk, and a .buffer() method that will
   * asynchronously load the a given image and cache the resulting buffer in
   * case it is needed later
   */
  async function LOAD_DATA (tracker) {
    VLDT('O', arguments)
    const fileTracker = tracker.newGroup('data files')
    const dataDir = PATH.resolve(__dirname, '../../data/paper-pictures')
    const dirs = await GET_DIRS(dataDir, tracker)
    return Promise.all(dirs.map(
      async dir => {
        const dTracker = fileTracker.newItem(`Loading data from ${dir}/img.json`, 1)
        let data
        try {
          const path = PATH.join(dataDir, dir, 'img.json')
          data = JSON.parse(await READ(path, 'utf8'))
        } catch (_) {}
        data.imgPath = PATH.join(dataDir, dir, data.filename)
        data.buffer = async function () {
          if (!this.cache || this.cache.hasExpired()) {
            const buffer = await READ(data.imgPath)
            if (this.cache) {
              this.cache.update(buffer)
            } else {
              this.cache = CACHE.newCache(buffer, { maxAge: 300000 })
            }
          }
          return this.cache.get()
        }
        dTracker.finish()
        return data
      }
    ))
  }

  /**
   * Get all of the directories written to by paper-scraper
   * @param   {String} dir      The top directory paper-scraper writes to
   * @param   {Object} tracker  An “are-we-there-yet” tracker instance
   * @return  {String[]}        Array of directory names
   */
  async function GET_DIRS (dir, tracker) {
    VLDT('SO', arguments)
    const dirTracker = tracker.newGroup('directories')
    let files = await READ_DIR(dir)
    files = await Promise.all(files.map(async file => {
      const path = PATH.join(dir, file)
      const fTracker = dirTracker.newItem(`Checking path ${path}`, 1)
      const stat = await STAT(path)
      fTracker.finish()
      return (stat.isDirectory() && file)
    }))
    return files.filter(f => f !== false)
  }

  return GET_DATA
}())
