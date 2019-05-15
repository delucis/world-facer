const VLDT = require('@delucis/aproba')
const blurRect = require('./blurRect')
const { Size, Box } = require('../box-classes')
const { isNumber } = require('../validators')

module.exports = ImageDrawer

/**
 * Get an image drawing function for use on Image load
 * @param {Object} ctx        2D canvas context
 * @param {Object} img        Image to draw
 * @param {Number} x          Where to draw the image
 * @param {Number} y          Where to draw the image
 * @param {Object} o          Options
 * @param {Number} o.w        How wide to draw the image
 * @param {Number} o.h        How high to draw the image
 * @param {Number} [o.zoom=1] How much to zoom in or out of the image
 * @param {Number} [o.blur=0] Blur radius for image
 */
function ImageDrawer (ctx, img, x, y, { w, h, zoom = 1, blur = 0 } = {}) {
  VLDT('OONN|OONNO', arguments)
  return () => {
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([
      isNumber(w) ? w : img.width,
      isNumber(h) ? h : img.height
    ])
    const targetBox = imgBox.cropped(targetSize).zoom(zoom)
    ctx.drawImage(img, ...targetBox, x, y, ...targetSize)
    if (blur > 0) blurRect(ctx, x, y, ...targetSize, blur)
  }
}
