const VLDT = require('@delucis/aproba')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const { Box } = require('../box-classes')

module.exports = brightnessRect

/**
 * Filter the saturation of a rectangular portion of a canvas
 *
 * @param  {Object} ctx             2D canvas context
 * @param  {Number} x               X co-ordinate of rectangle’s left side
 * @param  {Number} y               Y co-ordinate of rectangle’s top side
 * @param  {Number} w               Rectangle’s width
 * @param  {Number} h               Rectangle’s height
 * @param  {Number} [amount=100]    Adjustment amount (0 = min, 100 = none, 200 = max)
 */
function brightnessRect (ctx, x, y, w, h, amount = 100) {
  VLDT('ONNNN|ONNNNN', arguments)
  const rect = new Box([x, y, w, h]).round()
  amount = (CLAMP(amount, 0, 200) - 100) * 2.55
  if (amount === 0 || rect.area() === 0) return

  const imageData = ctx.getImageData(...rect)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    data[i] = CLAMP(data[i] + amount, 0, 255)
    data[i + 1] = CLAMP(data[i + 1] + amount, 0, 255)
    data[i + 2] = CLAMP(data[i + 2] + amount, 0, 255)
  }

  ctx.putImageData(imageData, ...rect.position())
}
