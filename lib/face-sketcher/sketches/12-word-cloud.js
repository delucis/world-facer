const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PROFANITIES = new Set(require('profanities'))
const PP = require('../../paper-pictures')
const PW = require('../../paper-words')
const NLP = require('../../nlp')
const URN = require('../../urn')
const { drawRect, drawText, drawHorizon } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

const bgImages = [
  'https-media-guim-co-uk-dded9cb648b4de50a1c0c8627496e875e62c2692-570-0-2979-2980-2979-jpg',
  'https-assets-jpcust-jwpsrv-com-thumbs-esf6mzaa-720-jpg',
  'http-rockpapershotgun-com-images-17-jan-slavery1-jpg',
  'http-bostonreview-net-sites-default-files-styles-medium-public-lebron-20black-20panther-20tile-jpg-itok-mwhvtusi',
  'http-artpulsemagazine-com-wp-content-uploads-2013-08-1-kubick-humcap1-sized-jpg',
  'http-sites-barbican-org-uk-basquiatdowntown-media-background-blue-mr-jpg',
  'https-cdn-theatlantic-com-assets-media-img-posts-2015-07-letter-2-d99378bf6-jpg',
  'http-cdm-link-app-uploads-2017-03-cover-1600-1024x1024-jpg',
  'http-bostonreview-net-sites-default-files-styles-medium-public-michaelbrown-jpg-itok-frt-feam',
  'http-rockpapershotgun-com-images-15-aug-hoibrit-jpg',
  'http-www-onshegoes-com-wp-content-uploads-2017-07-baniamor-bookmarked-carolynfinneyinterview-blackfacescover-660x1024-jpg',
  'http-static-poetryfoundation-org-o-harriet-2015-04-mtv1-jpg',
  'http-blog-calarts-edu-wp-content-uploads-2017-05-05smithportrat-copy-640x432-jpg',
  'http-sites-barbican-org-uk-basquiatdowntown-media-background-pink-mr-4jyqmxg-jpg',
  'http-sites-barbican-org-uk-basquiatdowntown-media-background-pink-mr-jpg',
  'https-assets-jpcust-jwpsrv-com-thumbs-5lyoo6yi-720-jpg',
  'http-static-poetryfoundation-org-o-harriet-2015-04-tl10-png'
]

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

module.exports = async function sketch ({ width, height, duration, fps }) {
  await PP() // prime paper pictures cache
  const images = await Promise.all(bgImages.map(async i => PP.getImage(i)))

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

  const aperturePoints = [
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
  ].map(([x, y]) => [x, y * height / 1080])

  let apertureCacheTime, apertureCache
  function getAperture (time) {
    if (apertureCacheTime !== time) {
      apertureCacheTime = time
      apertureCache = lerpPoints(aperturePoints, time / 70 * 52, { smooth: true })
    }
    return apertureCache
  }

  const frames = duration * fps + 1
  const endPos = 47.25 / 52
  const boxWidthPoints = [
    [0, 1920],
    [0.286, 1920],
    [0.3, 960], [0.37, 960],
    [endPos, 5760]
  ].map(([x, y]) => [x, y * width / 1920])
  const boxHeightPoints = [
    [0, 100],
    [0.286, 600],
    [0.3, 200], [0.37, 200],
    [endPos, 3240]
  ].map(([x, y]) => [x, y * height / 1080])
  const sizePoints = [
    [0, 67.5],
    [0.286, 67.5],
    [0.3, 67.5], [0.37, 67.5],
    [endPos, 90]
  ].map(([x, y]) => [x, y * height / 1080])
  const wordCountPoints = [
    [0, 0],
    [0.286, 12],
    [0.3, 0], [0.37, 0],
    [endPos, 250]
  ]

  const wordObjects = []
  for (let i = 0; i < frames; i++) {
    const frame = []
    const playhead = i / frames
    const boxWidth = lerpPoints(boxWidthPoints, playhead, { smooth: true })
    const boxHeight = lerpPoints(boxHeightPoints, playhead, { smooth: true })
    const size = lerpPoints(sizePoints, playhead, { smooth: true })
    const wordCount = Math.round(
      lerpPoints(wordCountPoints, playhead, { smooth: true })
    )
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

  return async ({ context: ctx, time, frame, fps, playhead, Image }) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    const aperture = getAperture(time)
    const barFlicker = getFlicker()
    const heightFlicker = Math.max(0, aperture - (1 - barFlicker) * 10)
    const transitionTime = 3.5
    const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
    const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
    const image1 = await images[imageIndex1].buffer()
    const image2 = await images[imageIndex2].buffer()
    const img1 = new Image()

    ctx.globalAlpha = barFlicker
    img1.onload = drawHorizon(ctx, img1, { aperture: heightFlicker })
    img1.src = image1
    ctx.globalAlpha = EASE(time / transitionTime % 1) * barFlicker
    const img2 = new Image()
    img2.onload = drawHorizon(ctx, img2, { aperture: heightFlicker })
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
