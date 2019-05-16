const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { drawRect, drawHorizon } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const images = await sm.follower({ start: RANDOM.rangeFloor(sm.keys.length) }).images()

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpPoints(
      [
        [0, 0],
        [2.7, 20], [21.5, 20],
        [24.35, 0],
        [27, 20], [36, 20],
        [37.85, 30], [39.2, 30],
        [41, 20], [47.25, 20],
        [50, 0]
      ],
      time
    )
    const transitionTime = 4
    const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()
    img1.onload = drawHorizon(ctx, img1, { aperture })
    img1.src = image1
    ctx.globalAlpha = EASE(time / transitionTime % 1)
    const img2 = new Image()
    img2.onload = drawHorizon(ctx, img2, { aperture })
    img2.src = image2
  }
}
