const VLDT = require('@delucis/aproba')
const { Box } = require('../box-classes')

module.exports = grayscaleRect

/**
 * Convert a rectangular portion of a canvas to grayscale
 *
 * @param {Object} ctx        2D canvas context
 * @param {Number} x          X co-ordinate of rectangle’s left side
 * @param {Number} y          Y co-ordinate of rectangle’s top side
 * @param {Number} w          Rectangle’s width
 * @param {Number} h          Rectangle’s height
 */
function grayscaleRect (ctx, x, y, w, h) {
  VLDT('ONNNN|ONNNNN', arguments)
  const rect = new Box([x, y, w, h]).round()
  if (rect.area() === 0) return

  const imageData = ctx.getImageData(...rect)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    // sum weighted RGB values to calculate luminance
    const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = y
  }

  ctx.putImageData(imageData, ...rect.position())
}
