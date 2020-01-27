const VLDT = require('@delucis/aproba')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const { Box } = require('../box-classes')

module.exports = noiseRect

/**
 * Add pixel noise to a rectangular portion of a canvas
 *
 * @param  {Object} ctx             2D canvas context
 * @param  {Number} x               X co-ordinate of rectangle’s left side
 * @param  {Number} y               Y co-ordinate of rectangle’s top side
 * @param  {Number} w               Rectangle’s width
 * @param  {Number} h               Rectangle’s height
 * @param  {Number} [deviation=0]   Max deviation amount (0 = none, more = more)
 */
function noiseRect (ctx, x, y, w, h, deviation = 0) {
  VLDT('ONNNN|ONNNNN', arguments)
  if (deviation === 0) return
  const { width, height } = ctx.canvas
  const rect = new Box([x, y, w, h]).round().intersect([width, height])
  if (rect.area() === 0) return

  const imageData = ctx.getImageData(...rect)
  const { data } = imageData
  const pixelMax = 255
  const shiftBasis = deviation / 100 * pixelMax

  for (let i = 0; i < data.length; i += 4) {
    const shift = shiftBasis * (Math.random() - 0.5)
    data[i] = CLAMP(data[i] + shift, 0, pixelMax)
    data[i + 1] = CLAMP(data[i + 1] + shift, 0, pixelMax)
    data[i + 2] = CLAMP(data[i + 2] + shift, 0, pixelMax)
  }

  ctx.putImageData(imageData, ...rect.position())
}
