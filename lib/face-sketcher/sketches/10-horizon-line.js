const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP, fract: FRACT } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { Size, Box } = require('../../box-classes')
const { drawRect } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

function ImageDrawer (ctx, img, { zoom = 13, w = 20, h = 20 } = {}) {
  return () => {
    const { width, height } = ctx.canvas
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([w, h])
    const targetBox = imgBox.cropped(targetSize).zoom(zoom)
    const xOffset = width / 2 - 405
    const x = CLAMP(xOffset - w / 2, 0, width)
    const y = height / 2 - targetSize.height / 2
    ctx.drawImage(img, ...targetBox, x, y, ...targetSize)
  }
}

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const slowMoverStartIndex = RANDOM.rangeFloor(sm.keys.length)
  console.log(`Starting sequence on ${slowMoverStartIndex}`)
  const images = await sm.follower({ start: slowMoverStartIndex }).images()

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpPoints(
      [
        [0, 378],
        [2 / 3, 0], [4, 0],
        [6.5, 10],
        [10, 5],
        [17, 15],
        [20, 0]
      ],
      time,
      { smooth: true }
    )
    const window = lerpPoints(
      [
        [0, 672],
        [3, width]
      ],
      time,
      { smooth: true }
    )
    const transitionTime = 3
    const indexPosition = lerpPoints(
      [
        [0, 0],
        [duration, duration / transitionTime]
      ],
      time
    )
    const zoom = lerpPoints(
      [
        [0, 13]
      ],
      time,
      { smooth: true }
    )
    const imageIndex1 = CLAMP(Math.floor(indexPosition), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()
    img1.onload = ImageDrawer(ctx, img1, { h: aperture, w: window, zoom })
    img1.src = image1
    ctx.globalAlpha = EASE(FRACT(indexPosition))
    const img2 = new Image()
    img2.onload = ImageDrawer(ctx, img2, { h: aperture, w: window, zoom })
    img2.src = image2
  }
}
