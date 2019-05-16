const VLDT = require('@delucis/aproba')
const { Box } = require('../box-classes')

module.exports = saturateRect

/**
 * Filter the saturation of a rectangular portion of a canvas
 *
 * @param  {Object} ctx             2D canvas context
 * @param  {Number} x               X co-ordinate of rectangle’s left side
 * @param  {Number} y               Y co-ordinate of rectangle’s top side
 * @param  {Number} w               Rectangle’s width
 * @param  {Number} h               Rectangle’s height
 * @param  {Number} [saturate=100]  Saturation amount (0 = grayscale, 100 = unchanged, > 100 = more saturated)
 */
function saturateRect (ctx, x, y, w, h, saturate = 100) {
  VLDT('ONNNN|ONNNNN', arguments)
  const rect = new Box([x, y, w, h]).round()
  if (saturate === 100 || rect.area() === 0) return

  const imageData = ctx.getImageData(...rect)
  const { data } = imageData
  saturate = -(saturate / 100 - 1)

  for (let i = 0; i < data.length; i += 4) {
    let max = Math.max(data[i], data[i + 1], data[i + 2])
    data[i] += max !== data[i] ? (max - data[i]) * saturate : 0
    data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * saturate : 0
    data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * saturate : 0
  }

  ctx.putImageData(imageData, ...rect.position())
}
