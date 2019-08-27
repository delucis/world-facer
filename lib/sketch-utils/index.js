const VLDT = require('@delucis/aproba')
const EASINGS = require('eases')
const { lerpFrames, clamp01, clamp, smoothstep, mapRange } = require('canvas-sketch-util/math')
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

/**
 * Interpolate Y co-ordinate based on its X co-ordinate
 * @param  {Array[]} points Array of point tuples
 * @param  {Number}  x      Position along X axis
 * @param  {Boolean} smooth Enable smoothstep interpolation
 * @param  {String}  easing Use an function from `eases` for interpolation
 * @return {Number}         Interpolated Y values
 */
function lerpPoints (points, x, { smooth = false, easing } = {}) {
  VLDT('AN|ANO', arguments)
  VLDT('BZ|BS', [smooth, easing])
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
    let smoothed
    if (easing && EASINGS[easing]) {
      smoothed = EASINGS[easing](mapRange(x, a[0], b[0], 0, 1))
    } else if (smooth) {
      smoothed = smoothstep(a[0], b[0], x)
    }
    if (typeof smoothed === 'number') x = mapRange(smoothed, 0, 1, a[0], b[0])
    return mapRange(x, a[0], b[0], a[1], b[1])
  }
  return points[points.length - 1][1]
}
