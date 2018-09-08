const VLDT = require('aproba')

module.exports = {
  /**
   * Shorten a string by collapsing it in the middle
   * @param  {String} s                   String to collapse
   * @param  {Object} o                   Options
   * @param  {Number} [o.length=30]       Length to collapse the string to
   * @param  {String} [o.separator='...'] Separator to insert in string middle
   * @return {String}                     Collapsed string
   */
  collapse: (s, { length = 30, separator = '...' } = {}) => {
    VLDT('SNS', [s, length, separator])
    if (s.length <= length) return s
    const charCount = length - separator.length
    const frontCount = Math.floor(charCount / 2)
    const backCount = Math.ceil(charCount / 2)

    return s.substr(0, frontCount) + separator + s.substr(s.length - backCount)
  }
}
