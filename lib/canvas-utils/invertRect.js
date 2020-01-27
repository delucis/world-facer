const VLDT = require('@delucis/aproba')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const { Box } = require('../box-classes')

module.exports = invertRect

/**
 * Filter the saturation of a rectangular portion of a canvas
 *
 * @param  {Object} ctx             2D canvas context
 * @param  {Number} x               X co-ordinate of rectangle’s left side
 * @param  {Number} y               Y co-ordinate of rectangle’s top side
 * @param  {Number} w               Rectangle’s width
 * @param  {Number} h               Rectangle’s height
 * @param  {Number} [amount=100]    Inversion amount (0 = none, 100 = full)
 */
function invertRect (ctx, x, y, w, h, amount = 100) {
  VLDT('ONNNN|ONNNNN', arguments)
  const { width, height } = ctx.canvas
  const rect = new Box([x, y, w, h]).round().intersect([width, height])
  amount = CLAMP(amount, 0, 100) / 100
  if (amount === 0 || rect.area() === 0) return

  const imageData = ctx.getImageData(...rect)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * (1 - amount) + (255 - data[i]) * amount
    data[i + 1] = data[i + 1] * (1 - amount) + (255 - data[i + 1]) * amount
    data[i + 2] = data[i + 2] * (1 - amount) + (255 - data[i + 2]) * amount
  }

  ctx.putImageData(imageData, ...rect.position())
}
