const VLDT = require('@delucis/aproba')
const { isNumber, isPositiveNumber, isNumberInRangeInclusive, isPercentageString, isCSSColorString } = require('../validators')

function coerce (val, vals, { validator = () => false } = {}) {
  VLDT('A|AF', [vals, validator])
  let valid = vals.includes(val) || validator(val)
  if (valid) return val
  const coerced = vals[0]
  return coerced
}

const properties = [
  ['style', ['normal', 'italic', 'oblique']],
  ['variant', ['normal', 'small-caps']],
  [
    'weight',
    ['normal', 'bold'],
    val => isNumberInRangeInclusive(val, [1, 1000])
  ],
  [
    'stretch',
    ['normal', 'semi-condensed', 'condensed', 'extra-condensed', 'ultra-condensed', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'],
    isPercentageString
  ],
  ['size',
    [16, 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'],
    isPositiveNumber
  ],
  ['lineHeight', [1], isPositiveNumber],
  ['color', ['#000'], isCSSColorString],
  ['align', ['start', 'end', 'left', 'right', 'center']],
  ['baseline', ['alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom']],
  ['background', ['transparent'], isCSSColorString],
  ['borderColor', ['#000'], isCSSColorString],
  ['borderWidth', [0], isPositiveNumber],
  ['padding', [0], isNumber]
]

module.exports = properties.reduce((exports, [name, vals, validator]) => {
  exports[name] = (val) => coerce(val, vals, { validator })
  return exports
}, {})
