/**
 * Wrap a string in ANSI colour codes
 * @param {String} s      String to wrap
 * @param {Number} [c=37] Colour code to use (default is white)
 */
const COLOR = (s, c = 37) => '\u001b[' + c + 'm' + s + '\u001b[39m'

/**
 * Try to indent an array of strings or string-like entities
 * @param {Array} rest Array to format (affects strings, numbers and booleans)
 */
const PAD_REST = rest => rest.map(i => {
  if (typeof i === 'string' || typeof i === 'number' || typeof i === 'boolean') {
    return `\n      ${i}`
  }
  return i
})

module.exports = {
  /**
   * Wrap a string in ANSI codes to style it bold in the terminal
   * @param  {String} s String to make bold
   * @return {String}   Bold string
   */
  b: s => '\u001b[' + 1 + 'm' + s + '\u001b[' + 22 + 'm',

  /**
   * Wrap a string in ANSI codes to style it blue in the terminal
   * @param  {String} s String to make blue
   * @return {String}   Blue string
   */
  blue: s => COLOR(s, 34),

  /**
   * Wrap a string in ANSI codes to style it red in the terminal
   * @param  {String} s String to make red
   * @return {String}   Red string
   */
  red: s => COLOR(s, 31),

  /**
   * Wrap a string in ANSI codes to style it yellow in the terminal
   * @param  {String} s String to make yellow
   * @return {String}   Yellow string
   */
  yellow: s => COLOR(s, 33),

  /**
   * Wrap a string in ANSI codes to style it white in the terminal
   * @param  {String} s String to make white
   * @return {String}   White string
   */
  white: s => COLOR(s),

  /**
   * Fancier console.log() with coloured `info` flag and multi-line indentation
   * @param  {String} s String to log
   */
  log: function (s) {
    const rest = PAD_REST(Array.from(arguments).slice(1))
    console.log(`${this.b(this.blue('info'))}  ${s}`, ...rest)
  },

  /**
   * Fancier console.warn() with coloured `warn` flag and multi-line indentation
   * @param  {String} s String to log
   */
  warn: function (s) {
    const rest = PAD_REST(Array.from(arguments).slice(1))
    console.warn(`${this.b(this.yellow('warn'))}  ${s}`, ...rest)
  },

  /**
   * Fancier console.error() with coloured `error` flag and multi-line
   * indentation
   * @param  {String|Error} e Error string to log
   */
  err: function (e) {
    const rest = PAD_REST(Array.from(arguments).slice(1))
    console.error(`${this.b(this.red('error'))} ${e}`, ...rest)
  }
}
