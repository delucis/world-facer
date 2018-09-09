const FS = require('fs')
const PATH = require('path')
const UTIL = require('util')
const VLDT = require('@delucis/aproba')
const GG = require('gauge')
const TRACKER = require('are-we-there-yet').TrackerGroup
const STRIP = require('strip')
const CACHE = require('../cache-utils')

const READ = UTIL.promisify(FS.readFile)
const READ_DIR = UTIL.promisify(FS.readdir)
const STAT = UTIL.promisify(FS.stat)

/**
 * Get a string containing sanitised text from all the Instapaper bookmarks
 * @return {String} A very very long string
 */
module.exports = async function () {
  const data = await GET_DATA()
  const megaString = data.reduce((s, d) => s + '\n\n\n\n' + d.text, '')
  const cleanString = STRIP(megaString)
  return cleanString
}

/**
 * Get a string containing the titles of all the Instapaper bookmarks
 * @return {String} A fairly long string
 */
module.exports.titles = async function () {
  const data = await GET_DATA()
  return data.reduce((s, d) => s + '\n\n' + d.title, '')
}

/**
 * Get a string containing the authors of the Instapaper bookmarks where known
 * @return {String} A fairly long string
 */
module.exports.authors = async function () {
  const data = await GET_DATA()
  return data.reduce((s, d) => s + (d.author ? '\n\n' + d.author : ''), '')
}

/**
 * Get direct access to the array of Instapaper bookmark objects
 * @return {Object[]} Array of Instapaper bookmark objects
 */
module.exports.data = async function () {
  return GET_DATA()
}

/**
 * Get paper-scraper data either from disk or, if already cached, from cache
 * @return {Object[]} Array of bookmark data objects
 */
async function GET_DATA () {
  if (!this.cache || this.cache.hasExpired()) {
    const tracker = new TRACKER('paper words')
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
 * Gather all the data from data-scraper’s JSON output files
 * @param  {Object}   tracker An “are-we-there-yet” tracker instance
 * @return {Object[]}         An array of bookmark data objects
 */
async function LOAD_DATA (tracker) {
  VLDT('O', arguments)
  const fileTracker = tracker.newGroup('data files')
  const dataDir = PATH.resolve(__dirname, '../../data/paper-scraper')
  const dirs = await GET_DIRS(dataDir, tracker)
  return Promise.all(dirs.map(
    async dir => {
      const dTracker = fileTracker.newItem(`Loading data from ${dir}/index.json`, 1)
      let data
      try {
        const path = PATH.join(dataDir, dir, 'index.json')
        data = JSON.parse(await READ(path, 'utf8'))
      } catch (_) {}
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
