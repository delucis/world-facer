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
  const start = 1899 // RANDOM.rangeFloor(sm.keys.length)
  console.log(`Staring sequence on ${start}`)
  const images = await sm.follower({ start }).images()

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpPoints(
      [
        [0, 0],
        [0.136, 5], [0.455, 5],
        [0.591, 10], [0.773, 10],
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
    const transitionTime = 5
    const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()
    ctx.globalAlpha = flicker
    img1.onload = drawHorizon(ctx, img1, { aperture: heightFlicker })
    img1.src = image1
    ctx.globalAlpha = EASE(time / transitionTime % 1) * flicker
    const img2 = new Image()
    img2.onload = drawHorizon(ctx, img2, { aperture: heightFlicker })
    img2.src = image2
  }
}
