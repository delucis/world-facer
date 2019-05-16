const EASE = require('eases/quad-in')
const { clamp: CLAMP, fract: FRACT } = require('canvas-sketch-util/math')
const RANDOM = require('canvas-sketch-util/random')
const PW = require('../../paper-words')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { sentences } = require('../../nlp')
const { drawRect, drawText, drawHorizon } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch () {
  await Promise.all([PP(), PW()]) // prime caches
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const slowMoverStartIndex = 1080
  const offset = 12
  const images = (await sm.follower({ start: slowMoverStartIndex }).images()).slice(offset)
  console.log(`Starting sequence on ${slowMoverStartIndex} with offset of ${offset}`)
  const text = await Promise.all(images.map(async (image, index) => {
    const determine = RANDOM.createRandom(index)
    const bookmark = await PW.getId(image.bookmark_id)
    if (bookmark.text) {
      return determine.pick(sentences(bookmark.text)).split(/\s+/)
    }
    return []
  }))
  const transitionTime = 4
  // const wordInterval = 5 / 24 // new word every n seconds

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height, deltaTime }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = 300
    const zoom = lerpPoints(
      [
        [0, 14],
        [duration * 0.5, 11],
        [duration * 0.65, 12],
        [duration, 1]
      ],
      time,
      { smooth: true }
    )
    const indexPosition = lerpPoints(
      [
        [0, 0],
        [duration, duration / transitionTime]
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
    ctx.globalAlpha = 1

    const textIndex = imageIndex1
    const wordIndex = Math.floor(FRACT(indexPosition) * (text[textIndex].length - 1))
    const word = text[textIndex][wordIndex]
    const determine = RANDOM.createRandom(textIndex * wordIndex)
    if (word && determine.chance(2 / 13)) {
      const positions = [
        [width * 0.75, height * 0.5],
        [width * 0.25, height * 0.465],
        [width * 0.74, height * 0.49],
        [width * 0.76, height * 0.51],
        [width * 0.76, height * 0.51],
        [width / 3, height * 0.75]
      ]
      const colors = [
        'black', 'black', 'black', 'black', 'black', '#ffb7ed'
      ]

      const pick = determine.rangeFloor(positions.length)

      RANDOM.permuteNoise()
      const position = positions[pick].map(coord => coord + RANDOM.noise1D(coord, 1, 4))

      drawText(
        ctx, word, ...position,
        { baseline: 'middle', color: colors[pick] }
      )
    }
  }
}
