const VLDT = require('@delucis/aproba')
const ImageDrawer = require('./ImageDrawer')
const { Box } = require('../box-classes')

module.exports = drawHorizon

/**
 * Get an image drawing function for a centered “horizon line”
 * @param  {Object} ctx                       2D canvas context
 * @param  {Object} img                       Image to draw on load
 * @param  {Object} o                         Options
 * @param  {Number} [o.zoom=13]               Zoom into image by this factor
 * @param  {Number} [o.aperture=20]           Line height
 * @param  {Number} [o.span=ctx.canvas.width] Line width (default: canvas width)
 * @param  {Number} [o.vOffset=0]             Offset for the centred horizon
 * @return {Function}                         Function to call on image load
 */
function drawHorizon (
  ctx, img,
  {
    zoom = 13,
    aperture = 20,
    span = ctx.canvas.width,
    vOffset = 0
  } = {}
) {
  VLDT('OO|OOO', arguments)
  VLDT('NNNN', [zoom, aperture, span, vOffset])
  const { width, height } = ctx.canvas
  const [x, y, w, h] = [...new Box([width, height]).crop([span, aperture]).translate([0, vOffset])]
  return ImageDrawer(ctx, img, x, y, { w, h, zoom })
}
