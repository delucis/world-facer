const VLDT = require('@delucis/aproba')
const { lerpFrames, clamp01, clamp, mapRange } = require('canvas-sketch-util/math')
const { isNumberInRangeInclusive } = require('../validators')

module.exports = {
  rangesIncludeValue,
  lerpBreakpoints,
  stepBreakpoints,
  lerpPoints
}

/**
 * Test if a value is included by one or more of the provided ranges
 * @param  {Array[]} ranges An array of [min, max] tuples
 * @param  {Number}  value  A value to test
 * @return {Boolean}        True if value within one or more of ranges
 */
function rangesIncludeValue (ranges, value) {
  VLDT('AN', arguments)
  const result = ranges.filter(range => {
    if (!Array.isArray(range)) {
      throw new TypeError(
        `Expected array of arrays, found member of type ${typeof range}`
      )
    }
    return isNumberInRangeInclusive(value, range)
  })
  return result.length !== 0
}

/**
 * Alias for lerpFrames from canvas-sketch-util/math
 * @param  {Array}  breakpoints An array of values to interpolate
 * @param  {Number} x           Position in line to sample (0–1)
 * @return {*}  Interpolated value at position t
 */
function lerpBreakpoints (breakpoints, x) {
  VLDT('AN', arguments)
  return lerpFrames(breakpoints, x)
}

/**
 * Step through breakpoints
 * @param  {Array}  breakpoints An array of values to step through
 * @param  {Number} x           Position in line to sample (0–1)
 * @return {*}  Returns the value at the array index corresponding to x
 */
function stepBreakpoints (breakpoints, x) {
  VLDT('AN', arguments)
  x = clamp01(x)
  return breakpoints[Math.floor((breakpoints.length - 1) * x)]
}

function lerpPoints (points, x) {
  VLDT('AN', arguments)
  points = [...points].sort((a, b) => a[0] - b[0])
  x = clamp(x, points[0][0], points[points.length - 1][0])
  let a, b
  for (let i = 0; i < points.length - 1; i++) {
    if (x >= points[i][0] && x < points[i + 1][0]) {
      a = points[i]
      b = points[i + 1]
      break
    }
  }
  if (a) {
    return mapRange(x, a[0], b[0], a[1], b[1])
  }
  return points[points.length - 1][1]
}
