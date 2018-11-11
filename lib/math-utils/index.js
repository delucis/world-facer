const VLDT = require('@delucis/aproba')

module.exports = {
  toFixed
}

/**
 * Round a number to fixed precision, similar to Number.prototype.toFixed
 * @param  {Number} n             Number to round
 * @param  {Number} [precision=0] Precision after the decimal point
 * @return {Number}               The rounded number
 */
function toFixed (n, precision = 0) {
  VLDT('N|NN', arguments)
  const factor = Math.pow(10, precision)
  return Math.round(n * factor) / factor
}
