const VLDT = require('@delucis/aproba')

module.exports = {
  isNull,
  isNaN,
  isNumber,
  isString,
  isPercentageString,
  isInteger,
  isPositiveNumber,
  isNegativeNumber,
  isNumberInRangeInclusive,
  isNumberInRangeExclusive,
  isWord,
  isHexString,
  isRGBString,
  isRGBAString,
  isHSLString,
  isHSLAString,
  isCSSColorString
}

function isNull (val) {
  VLDT('*', arguments)
  return val === null
}

function isNaN (val) {
  VLDT('*', arguments)
  return Number.isNaN(val)
}

function isNumber (val) {
  VLDT('*', arguments)
  return typeof val === 'number' && !isNaN(val)
}

function isString (val) {
  VLDT('*', arguments)
  return typeof val === 'string'
}

function isPercentageString (val) {
  VLDT('*', arguments)
  return isString(val) && /^-?\d*(\.\d+)?%$/.test(val) && !isNaN(parseFloat(val))
}

function isInteger (val) {
  VLDT('*', arguments)
  return isNumber(val) && val % 1 === 0
}

function isPositiveNumber (val) {
  VLDT('*', arguments)
  return isNumber(val) && val >= 0
}

function isNegativeNumber (val) {
  VLDT('*', arguments)
  return isNumber(val) && val < 0
}

function isNumberInRangeInclusive (val, [min = 0, max = 1] = []) {
  VLDT('*|*A', arguments)
  VLDT('NN', [min, max])
  return isNumber(val) && val >= min && val <= max
}

function isNumberInRangeExclusive (val, [min = 0, max = 1] = []) {
  VLDT('*|*A', arguments)
  VLDT('NN', [min, max])
  return isNumber(val) && val > min && val < max
}

function isWord (val) {
  VLDT('*', arguments)
  return isString(val) && /^[a-zA-Z]+$/.test(val)
}

function isHexString (val) {
  VLDT('*', arguments)
  return isString(val) && /^#([0-9a-fA-F]{3}){1,2}$/.test(val)
}

function isRGBString (val) {
  VLDT('*', arguments)
  return isString(val) && /^rgb\((\d*(.\d+)?,\s*){2}\d*(.\d+)?\)$/.test(val)
}

function isRGBAString (val) {
  VLDT('*', arguments)
  return isString(val) && /^rgba\((\d*(.\d+)?,\s*){3}\d*(.\d+)?\)$/.test(val)
}

function isHSLString (val) {
  VLDT('*', arguments)
  return isString(val) && /^hsl\(-?\d*(.\d+)?,\s*\d*(.\d+)?%,\s*\d*(.\d+)?%\)$/.test(val)
}

function isHSLAString (val) {
  VLDT('*', arguments)
  return isString(val) && /^hsla\(-?\d*(.\d+)?,(\s*\d*(.\d+)?%,){2}\s*\d*(.\d+)?%?\)$/.test(val)
}

function isCSSColorString (val) {
  VLDT('*', arguments)
  return isWord(val) || isHexString(val) || isRGBString(val) || isRGBAString(val) || isHSLString(val) || isHSLAString(val)
}
