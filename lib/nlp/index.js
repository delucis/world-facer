const VLDT = require('aproba')
const GUESS_LANG = require('franc-min')
const RETEXT = require('retext')
const KEYWORDS = require('retext-keywords')
const NL2STRING = require('nlcst-to-string')

/**
 * Get the best guess for the language of an input string
 * @param  {String} s Text to guess the language for
 * @return {String}   Three-letter language code, e.g. 'eng' for English
 */
module.exports.language = s => {
  VLDT('S', [s])
  return GUESS_LANG(s)
}

/**
 * Extract key phrases from an input string
 * @param  {String} s Text to extract key phrases from
 * @return {String[]} Array of key phrase strings
 */
module.exports.keyphrases = s => new Promise((resolve, reject) => {
  VLDT('S', [s])
  RETEXT().use(KEYWORDS).process(s, function (e, res) {
    if (e) reject(e)
    resolve(res.data.keyphrases.map(
      phrase => phrase.matches[0].nodes.map(NL2STRING).join('')
    ))
  })
})

/**
 * Extract key words from an input strings
 * @param  {String} s Text to extract key words from
 * @return {String[]} Array of key word strings
 */
module.exports.keywords = s => new Promise((resolve, reject) => {
  VLDT('S', [s])
  RETEXT().use(KEYWORDS).process(s, function (e, res) {
    if (e) reject(e)
    resolve(res.data.keywords.map(
      word => NL2STRING(word.matches[0].node)
    ))
  })
})
