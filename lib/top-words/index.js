const VLDT = require('aproba')
const COUNT = require('count-words')
const STOPS = require('stopwords-iso')

/**
 * Get an array of the most common words in a string
 * @param  {String}  s                 String to analyse
 * @param  {Object}  o                 Options object
 * @param  {Number}  [o.n=20]          Number of top words to retrieve
 * @param  {String}  [o.lang='en']     Language of the input string
 * @param  {Boolean} [o.includeCount=false] Return counts as well as words
 * @return {String[]|Array[]}          An array of the most common words
 */
module.exports = (s, { n = 20, lang = 'en', includeCount = false } = {}) => {
  VLDT('SNSB', [s, n, lang, includeCount])
  const stopwords = STOPS.hasOwnProperty(lang) ? STOPS[lang] : STOPS.en
  return Object.entries(COUNT(s, true))
    .filter(([word, n]) => !stopwords.includes(word) && word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(a => includeCount ? a : a[0])
}
