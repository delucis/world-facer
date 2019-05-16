const ImageDrawer = require('./ImageDrawer')
const { Box } = require('../box-classes')

module.exports = drawHorizon

function drawHorizon (ctx, img, { zoom = 13, aperture = 20 } = {}) {
  const { width, height } = ctx.canvas
  const [x, y, w, h] = [...new Box([width, height]).crop([width, aperture])]
  return ImageDrawer(ctx, img, x, y, { w, h, zoom })
}
