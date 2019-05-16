const EASE = require('eases/quad-in')
const { clamp: CLAMP, fract: FRACT } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { drawRect, drawText, drawHorizon } = require('../../canvas-utils')
const { rangesIncludeValue, lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const slowMoverStartIndex = 1080
  const images = await sm.follower({ start: slowMoverStartIndex }).images()
  const burstStartIndex = 50
  const burst = await sm.follower({ start: burstStartIndex }).images()
  console.log(`Starting main sequence on ${slowMoverStartIndex}`)
  console.log(`Starting burst on ${burstStartIndex}`)
  const text = [
    '', '', '', '', 'I', 'began', 'the', 'day', 'day', 'inside', 'the', 'world', 'world', 'trying', 'to', 'look', 'at', 'it,', 'it,', 'but', 'it', 'was', 'lying', 'on', 'my', 'face,', 'face,', 'making', 'it', 'hard', 'to', 'see.', 'see.'
  ]
  const transitionTime = 2.5
  const wordInterval = 5 / 24 // new word every n seconds
  const burstStartT = 3.75
  const startOpening = text.length * wordInterval
  const endOpening1 = startOpening + 2
  const endOpening2 = startOpening + 5

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height, deltaTime }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = lerpPoints([
      [0, 100], [startOpening, 100],
      [endOpening2, 300]
    ], time, { smooth: true })
    if (rangesIncludeValue([[burstStartT, burstStartT + 0.4]], time)) {
      const index = CLAMP(Math.floor((time - burstStartT) * fps), 0, burst.length - 1)
      const image = await burst[index].buffer()
      const img = new Image()
      img.onload = drawHorizon(ctx, img, { zoom: 3, aperture })
      img.src = image
    } else {
      const zoom = lerpPoints([[0, 11], [20, 14]], time, { smooth: true })
      const indexPosition = lerpPoints(
        [
          [0, 0],
          [endOpening1, endOpening1 / transitionTime],
          [duration, endOpening1 / transitionTime + (duration - endOpening1) / 4]
        ],
        time
      )
      const imageIndex1 = CLAMP(Math.floor(indexPosition), 0, images.length - 1)
      const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
      const image1 = await images[imageIndex1].buffer()
      const image2 = await images[imageIndex2].buffer()
      const img1 = new Image()
      img1.onload = drawHorizon(ctx, img1, { aperture, zoom })
      img1.src = image1
      ctx.globalAlpha = EASE(FRACT(indexPosition))
      const img2 = new Image()
      img2.onload = drawHorizon(ctx, img2, { aperture, zoom })
      img2.src = image2
    }
    ctx.globalAlpha = 1
    const textIndex = Math.floor(time / wordInterval)
    drawText(
      ctx, text[textIndex] || '', width / 2, height / 2,
      {
        color: '#ffb7ed',
        background: '#000',
        padding: [
          lerpPoints([[0, 16], [startOpening, 16], [endOpening1, 50]], time, { smooth: true }),
          lerpPoints([[0, 30], [startOpening, 30], [endOpening1, 0]], time, { smooth: true })
        ],
        minWidth: lerpPoints([[0, 360], [startOpening, 360], [endOpening1, 0]], time, { smooth: true }),
        align: 'center',
        baseline: 'middle'
      }
    )
  }
}
