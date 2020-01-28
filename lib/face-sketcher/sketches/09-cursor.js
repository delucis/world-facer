const { clamp: CLAMP } = require('canvas-sketch-util/math')
const RANDOM = require('canvas-sketch-util/random')
const PROFANITIES = new Set(require('profanities'))
const URN = require('../../urn')
const PW = require('../../paper-words')
const NLP = require('../../nlp')
const { drawLine, drawRect, blurRect, drawText } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch ({ width, height, totalFrames }) {
  const wordUrn = new URN(
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

  const vPad = 351
  const vCenter = height / 2
  const bottom = height - vPad
  const hPad = 160
  const right = width - hPad

  const boxWidth = width
  const size = 32
  const wordObjects = []

  for (let i = 0; i < totalFrames; i++) {
    const playhead = i / totalFrames
    const frame = []
    const lineTop = lerpPoints([[0, vPad], [1, vCenter]], playhead)
    const lineBottom = lerpPoints([[0, bottom], [1, vCenter]], playhead)
    const boxHeight = 2 * (lineBottom - lineTop)
    const wordCount = lerpPoints([[0, 10], [0.75, 8], [1, 0]], playhead)
    for (let j = 0; j < wordCount; j++) {
      let word
      if (RANDOM.chance(1 / 10) || i === 0 || !wordObjects[i - 1][j]) {
        word = {
          text: wordUrn.next(),
          x: RANDOM.gaussian(0.5, 0.125) * boxWidth,
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

  const flickerSet = [
    { value: 1, weight: 5 },
    { value: 0.8, weight: 70 },
    { value: 0.7, weight: 8 },
    { value: 0.6, weight: 4 },
    { value: 0.5, weight: 4 },
    { value: 0.35, weight: 3 },
    { value: 0.2, weight: 3 },
    { value: 0, weight: 3 }
  ]
  const getFlicker = () => RANDOM.weightedSet(flickerSet)

  return async function render ({ context: ctx, playhead, frame }) {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    const hue = lerpPoints([[0, 0], [1, 305]], playhead)

    const wordFrame = CLAMP(Math.floor(frame), 0, wordObjects.length)
    const wordColor = flicker => `hsl(${hue}, 100%, ${flicker * 20}%)`
    for (let idx = 0; idx < wordObjects[wordFrame].length; idx++) {
      const { text, x, y, z, size } = wordObjects[wordFrame][idx]
      const flicker = getFlicker()
      ctx.globalAlpha = flicker * z
      drawText(ctx, text, x, y, {
        baseline: 'middle',
        color: wordColor(flicker),
        size: size * z * (flicker / 2 + 1.5) / 2
      })
    }

    const lineTop = lerpPoints([[0, vPad], [1, vCenter]], playhead)
    const lineBottom = lerpPoints([[0, bottom], [1, vCenter]], playhead)
    const lineHeight = lineBottom - lineTop

    blurRect(ctx, 0, lineTop / 2, width, 2 * lineHeight, 2)

    const flicker = getFlicker()
    const brightness = flicker * 80

    drawLine(
      ctx,
      [[hPad, lineTop], [right, vCenter], [hPad, lineBottom]],
      { color: `hsl(${hue}, 100%, ${brightness}%)`, lineWidth: flicker + 1 }
    )

    blurRect(ctx, 0, lineTop / 2, width, 2 * lineHeight, (1 - flicker) * 10)
  }
}
