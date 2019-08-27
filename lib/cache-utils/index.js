const VLDT = require('@delucis/aproba')

/**
 * Is a given time too far in past?
 * @param  {Number}  t             Cache time as returned by Date.now()
 * @param  {Number}  [maxAge=60000] Maximum age before expiry (in milliseconds)
 * @return {Boolean}               True if t is more than maxAge ms in the past
 */
function hasExpired (t, { maxAge = 60000 } = {}) {
  VLDT('NN', [t, maxAge])
  return Date.now() - t > maxAge
}
module.exports.hasExpired = hasExpired

/**
 * Get a cache instance filled with your data
 * @param  {*}      data           Data to populate the cache with
 * @param  {Number} [maxAge=60000] Maximum age before cache expiry (in ms)
 * @return {Object}                Cache instance
 */
function newCache (data, { maxAge = 60000 } = {}) {
  VLDT('N', [maxAge])
  return (function () {
    let cacheTime = Date.now()

    return {
      get: () => data,
      update: (d) => { data = d; cacheTime = Date.now(); return this },
      hasExpired: () => hasExpired(cacheTime, { maxAge }),
      getAge: () => Date.now() - cacheTime
    }
  }())
}
module.exports.newCache = newCache
