const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { Size, Box } = require('../../box-classes')
const { drawRect } = require('../../canvas-utils')
const { rangesIncludeValue, lerpBreakpoints } = require('../../sketch-utils')

function ImageDrawer (ctx, img, { zoom = 13, h = 20 } = {}) {
  return () => {
    const { width, height } = ctx.canvas
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([width, h])
    const targetBox = imgBox.cropped(targetSize).zoom(zoom)
    ctx.drawImage(img, ...targetBox, 0, height / 2 - targetSize.height / 2, ...targetSize)
  }
}

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const images = await sm.follower({ start: RANDOM.rangeFloor(sm.keys.length) }).images()
  const burst = await sm.follower({ start: RANDOM.rangeFloor(sm.keys.length) }).images()

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpBreakpoints(
      [
        0,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        0,
        20, 20, 20, 20, 20, 20, 20, 20, 20,
        30, 30,
        20, 20, 20, 20, 20, 20,
        0
      ],
      playhead
    )
    if (rangesIncludeValue([[20, 20.5], [21.2, 21.4]], time)) {
      const index = CLAMP(Math.floor(frame - fps * 20), 0, burst.length - 1)
      const image = await burst[index].buffer()
      const img = new Image()
      img.onload = ImageDrawer(ctx, img, { zoom: 2, h: aperture })
      img.src = image
    } else {
      const transitionTime = 4
      const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
      const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
      const image1 = await images[imageIndex1].buffer()
      const image2 = await images[imageIndex2].buffer()
      const img1 = new Image()
      img1.onload = ImageDrawer(ctx, img1, { h: aperture })
      img1.src = image1
      ctx.globalAlpha = EASE(time / transitionTime % 1)
      const img2 = new Image()
      img2.onload = ImageDrawer(ctx, img2, { h: aperture })
      img2.src = image2
    }
  }
}
