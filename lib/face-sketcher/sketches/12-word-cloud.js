const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PROFANITIES = new Set(require('profanities'))
const PP = require('../../paper-pictures')
const PW = require('../../paper-words')
const SM = require('../../similarity-matrix')
const NLP = require('../../nlp')
const URN = require('../../urn')
const { Size, Box } = require('../../box-classes')
const { drawRect, drawText } = require('../../canvas-utils')
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

function getAperture (time) {
  return lerpPoints(
    [
      [0, 0],
      [1.5, 5], [5, 5],
      [6.5, 10], [8.5, 10],
      [11, 0], [13, 0],
      [20.75, 30],
      [21, 0],
      [23, 10],
      [24, 12],
      [25, 10],
      [26, 15],
      [27, 12],
      [29, 15],
      [31, 8],
      [33, 14], [40, 14],
      [50, 0]
    ],
    time / 70 * 52,
    { smooth: true }
  )
}

function getFlicker () {
  return RANDOM.weightedSet([
    { value: 1, weight: 5 },
    { value: 0.8, weight: 70 },
    { value: 0.7, weight: 8 },
    { value: 0.6, weight: 4 },
    { value: 0.5, weight: 4 },
    { value: 0.35, weight: 3 },
    { value: 0.2, weight: 3 },
    { value: 0, weight: 3 }
  ])
}

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const start = 3267 // RANDOM.rangeFloor(sm.keys.length)
  console.log(`Staring sequence on ${start}`)
  const images = await sm.follower({ start }).images()

  // The other option (instead of random) would be to use NLP.topwords to
  // extract most common words
  const randomWord = new URN(
    // shuffle word order
    RANDOM.shuffle(
      // process each bookmark
      (await PW.data()).map(({ text }) => {
        if (!text) return []
        // split article into sentences
        const sentences = NLP.sentences(text)
          // discard start and end of article
          .slice(6, -6)
          // exclude short sentences or sentences containing blocked words
          .filter(sentence => {
            if (!(sentence.split(/\s+/).length > 5)) return false
            let isClean = true
            for (let word = 0; word < sentence.length; word++) {
              if (PROFANITIES.has(sentence[word])) {
                isClean = false
                break
              }
            }
            return isClean
          })
        const sentence = RANDOM.pick(sentences) // pick random sentence
        if (sentence) return sentence.split(/\s+/) // split sentence into words
        return []
      })
        // flatten into single array of words
        .reduce((acc, val) => acc.concat(val), [])
    ), { autoReset: true }
  )

  const dur = 52
  const frames = dur * 24 + 1
  const width = 1920
  const height = 1080
  const wordObjects = []
  for (let i = 0; i < frames; i++) {
    const frame = []
    const playhead = i / frames
    const boxWidth = lerpPoints([
      [0, 1920],
      [0.286, 1920],
      [0.3, 960], [0.37, 960],
      [1, 2880]
    ], playhead, { smooth: true })
    const boxHeight = lerpPoints([
      [0, 100],
      [0.286, 600],
      [0.3, 200], [0.37, 200],
      [1, 1620]
    ], playhead, { smooth: true })
    const size = lerpPoints([
      [0, 67.5],
      [0.286, 67.5],
      [0.3, 67.5], [0.37, 67.5],
      [1, 90]
    ], playhead, { smooth: true })
    const wordCount = Math.round(lerpPoints([
      [0, 0],
      [0.286, 12],
      [0.3, 0], [0.37, 0],
      [1, 250]
    ], playhead, { smooth: true }))
    for (let j = 0; j < wordCount; j++) {
      let word
      if (RANDOM.chance(1 / 4) || i === 0 || !wordObjects[i - 1][j]) {
        word = {
          text: randomWord.next(),
          x: RANDOM.gaussian(0.5, 0.125) * boxWidth + (width - boxWidth) / 2,
          y: RANDOM.gaussian(0.5, 0.125) * boxHeight + (height - boxHeight) / 2,
          z: RANDOM.gaussian(0.75, 0.125),
          size
        }
      } else {
        word = wordObjects[i - 1][j]
      }
      frame.push(word)
    }
    wordObjects.push(frame)
  }

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    const aperture = getAperture(time)
    const barFlicker = getFlicker()
    const heightFlicker = CLAMP(aperture - (1 - barFlicker) * 10, 0, Infinity)
    const transitionTime = 3.5
    const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()
    ctx.globalAlpha = barFlicker
    img1.onload = ImageDrawer(ctx, img1, { h: heightFlicker })
    img1.src = image1
    ctx.globalAlpha = EASE(time / transitionTime % 1) * barFlicker
    const img2 = new Image()
    img2.onload = ImageDrawer(ctx, img2, { h: heightFlicker })
    img2.src = image2

    const wordFrame = CLAMP(Math.floor(frame), 0, wordObjects.length)

    for (let idx = 0; idx < wordObjects[wordFrame].length; idx++) {
      const { text, x, y, z, size } = wordObjects[wordFrame][idx]
      const flicker = getFlicker()
      ctx.globalAlpha = flicker * z
      drawText(ctx, text, x, y, { baseline: 'middle', color: 'white', size: size * z * (flicker + 1) / 2 })
    }
  }
}
