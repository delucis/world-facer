const VLDT = require('@delucis/aproba')
const GUESS_LANG = require('franc-min')
const RETEXT = require('retext')
const KEYWORDS = require('retext-keywords')
const NL2STRING = require('nlcst-to-string')
const COUNT = require('count-words')
const STOPS = require('stopwords-iso')
const SBD = require('sbd')

/**
 * Process a string using `retext-keywords` and promise the result
 * @param   {String}  s Text to analyse
 * @return  {Promise<Object>} A ReText data object
 */
const PROCESS_STRING = s => new Promise((resolve, reject) => {
  VLDT('S', [s])
  RETEXT().use(KEYWORDS).process(s, function (e, res) {
    if (e) reject(e)
    resolve(res)
  })
})

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
 * Break a string into an array of sentence strings
 * @param  {String} s Text to break into sentences
 * @param  {Object} o Options object
 * @return {String[]} Array of sentence strings
 */
module.exports.sentences = (s, o = {}) => {
  VLDT('SO', [s, o])
  return SBD.sentences(s, Object.assign({
    html_boundaries: true,
    sanitize: true
  }, o))
}

/**
 * Extract key phrases from an input string
 * @param  {String} s Text to extract key phrases from
 * @return {Promise<String[]>} Array of key phrase strings
 */
module.exports.keyphrases = async s => {
  const res = await PROCESS_STRING(s)
  return res.data.keyphrases.map(
    phrase => phrase.matches[0].nodes.map(NL2STRING).join('')
  )
}

/**
 * Extract key words from an input strings
 * @param  {String} s Text to extract key words from
 * @return {Promise<String[]>} Array of key word strings
 */
module.exports.keywords = async s => {
  const res = await PROCESS_STRING(s)
  return res.data.keywords.map(
    word => NL2STRING(word.matches[0].node)
  )
}

/**
 * Get an array of the most common words in a string
 * @param  {String}  s                 String to analyse
 * @param  {Object}  o                 Options object
 * @param  {Number}  [o.n=20]          Number of top words to retrieve
 * @param  {String}  [o.lang='en']     Language of the input string
 * @param  {Boolean} [o.includeCount=false] Return counts as well as words
 * @return {String[]|Array[]}          An array of the most common words
 */
module.exports.topwords = (s, { n = 20, lang = 'en', includeCount = false } = {}) => {
  VLDT('SNSB', [s, n, lang, includeCount])
  const stopwords = STOPS[lang] || STOPS.en
  return Object.entries(COUNT(s, true))
    .filter(([word, n]) => !stopwords.includes(word) && word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(a => includeCount ? a : a[0])
}
