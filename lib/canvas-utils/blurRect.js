const VLDT = require('@delucis/aproba')
const BLUR = require('stackblur-canvas')
const { Box } = require('../box-classes')

module.exports = blurRect

/**
 * Blur a rectangular portion of a canvas
 *
 * @param  {Object} ctx        2D canvas context
 * @param  {Number} x          X co-ordinate of rectangle’s left side
 * @param  {Number} y          Y co-ordinate of rectangle’s top side
 * @param  {Number} w          Rectangle’s width
 * @param  {Number} h          Rectangle’s height
 * @param  {Number} [radius=0] Blur radius
 */
function blurRect (ctx, x, y, w, h, radius = 0) {
  VLDT('ONNNN|ONNNNN', arguments)
  const rect = new Box([x, y, w, h]).round()
  if (rect.area() > 0 && radius > 0) {
    BLUR.canvasRGBA(ctx.canvas, ...rect, radius)
  }
}
