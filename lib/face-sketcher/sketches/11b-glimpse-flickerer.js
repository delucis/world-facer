const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { Size, Box } = require('../../box-classes')
const { drawRect } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

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
  const start = 4082// RANDOM.rangeFloor(sm.keys.length)
  console.log(`Staring sequence on ${start}`)
  const images = await sm.follower({ start }).images()

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpPoints(
      [
        [0, 0],
        [0.136, 10], [0.455, 7],
        [0.591, 16], [0.773, 20],
        [1, 0]
      ],
      playhead,
      { smooth: true }
    )
    const flicker = RANDOM.weightedSet([
      { value: 1, weight: 5 },
      { value: 0.8, weight: 70 },
      { value: 0.7, weight: 8 },
      { value: 0.6, weight: 4 },
      { value: 0.5, weight: 4 },
      { value: 0.35, weight: 3 },
      { value: 0.2, weight: 3 },
      { value: 0, weight: 3 }
    ])
    const heightFlicker = CLAMP(aperture - (1 - flicker) * 10, 0, Infinity)
    const transitionTime = 3.5
    const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()
    ctx.globalAlpha = flicker
    img1.onload = ImageDrawer(ctx, img1, { h: heightFlicker })
    img1.src = image1
    ctx.globalAlpha = EASE(time / transitionTime % 1) * flicker
    const img2 = new Image()
    img2.onload = ImageDrawer(ctx, img2, { h: heightFlicker })
    img2.src = image2
  }
}
