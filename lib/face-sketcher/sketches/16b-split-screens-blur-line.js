const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP, lerp: LERP, wrap: WRAP } = require('canvas-sketch-util/math')
const EASEIN = require('eases/quad-in')
const EASEOUT = require('eases/quint-out')
const PP = require('../../paper-pictures')
const URN = require('../../urn')
const { Box } = require('../../box-classes')
const { blurRect, brightnessRect, drawRect, saturateRect, ImageDrawer } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch ({ width, height, duration }) {
  const pictures = await PP() // prime paper pictures cache
  const randomPicture = new URN(pictures, { autoReset: true })
  const alphaCycle = 1.5
  const frames = duration * 24
  const splits = 6
  const splitWidth = width / splits
  const images = []
  for (let i = 0; i < frames; i++) {
    const frame = []
    for (let j = 0; j < splits; j++) {
      let pic
      if (RANDOM.chance(3 / 4) || i === 0) {
        pic = randomPicture.next()
      } else {
        pic = images[i - 1][j]
      }
      frame.push(pic)
    }
    images.push(frame)
  }

  const pink = '#ffb7ed'
  const blue = '#0000ff'
  const colors = [pink, pink, pink, pink, blue]
  const frameTop = 351 / 1080 * height
  const frameHeight = height - frameTop
  const frameBox = new Box([0, frameTop, width, frameHeight])

  const blankSlatePoints = [
    [0, 1],
    [20, 0.1],
    [30, 0]
  ]

  const aperturePoints = [
    [0, 0],
    [30, 0],
    [31.5, 10], [35, 10],
    [36.5, 20], [38.5, 20],
    [41, 0], [42.5, 0],
    [57, 40], [66, 40],
    [81, 1080]
  ].map(([x, y]) => [x, y / 1080 * height])

  const darkenPoints = [
    [0, 100],
    [5, 100],
    [30, 65]
  ]

  const brightenPoints = [
    [0, 120], [66, 120],
    [74, 100]
  ]

  const saturationPoints = [
    [0, 100],
    [30, 300]
  ]

  return async (
    { context: ctx, time, frame, Image, playhead }
  ) => {
    // draw black base
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    // draw pulsing base colour layer
    ctx.globalAlpha = EASEIN(LERP(0, 1, WRAP(time, 0, alphaCycle) / alphaCycle))
    const colorIndex = Math.floor(time / alphaCycle) % colors.length
    drawRect(ctx, ...frameBox, { background: colors[colorIndex] })

    // draw initial white blank slate
    const blankSlateAlpha = lerpPoints(blankSlatePoints, time, { easing: 'quad-in' })
    ctx.globalAlpha = blankSlateAlpha
    drawRect(ctx, ...frameBox, { background: 'white' })

    const imagesIndex = CLAMP(Math.floor(frame), 0, images.length - 1)

    const zoom = LERP(13, 3, EASEOUT(playhead))

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'screen'
    for (let i = 0; i < splits; i++) {
      const image = await images[imagesIndex][i].buffer()
      const img = new Image()
      img.onload = ImageDrawer(ctx, img, i * splitWidth, frameTop, { h: frameHeight, w: splitWidth, zoom })
      img.src = image
    }

    ctx.globalAlpha = blankSlateAlpha
    drawRect(ctx, ...frameBox, { background: pink })

    const aperture = lerpPoints(aperturePoints, time, { easing: 'quintIn' })
    const saturation = lerpPoints(saturationPoints, time)
    const darken = lerpPoints(darkenPoints, time)

    if (aperture < 1) {
      brightnessRect(ctx, ...frameBox, darken)
      saturateRect(ctx, ...frameBox, saturation)
      blurRect(ctx, ...frameBox, 30 / 540 * height)
    } else {
      const upperBlurBox = new Box([0, frameTop, width, Math.max(0, height / 2 - frameTop - aperture / 2)])
      const lowerBlurBox = new Box([0, height / 2 + aperture / 2, width, height / 2 - aperture / 2])
      const blurBoxes = [upperBlurBox, lowerBlurBox]

      const brighten = lerpPoints(brightenPoints, time, { easing: 'quadIn' })

      blurBoxes.forEach(box => {
        brightnessRect(ctx, ...box, darken)
        saturateRect(ctx, ...box, saturation)
        blurRect(ctx, ...box, 30 / 540 * height)
      })

      brightnessRect(ctx, 0, height / 2 - aperture / 2, width, aperture, brighten)
    }
  }
}
