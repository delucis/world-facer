const COUNT = require('count-words')
const STOPS = require('stopwords-iso')

/**
 * Get an array of the most common words in a string
 * @param  {String} s                 String to analyse
 * @param  {Object} opts              Options object
 * @param  {Number} [opts.n=20]       Number of top words to retrieve
 * @param  {String} [opts.lang='en']  Language of the input string
 * @return {String[]}                 An array of the most common words
 */
module.exports = (s, { n = 20, lang = 'en' } = {}) => {
  const stopwords = STOPS.hasOwnProperty(lang) ? STOPS[lang] : STOPS.en
  return Object.entries(COUNT(s, true))
    .filter(([word, n]) => !stopwords.includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(a => a[0])
}
