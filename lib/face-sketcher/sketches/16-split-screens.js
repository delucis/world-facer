const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP, lerp: LERP, wrap: WRAP } = require('canvas-sketch-util/math')
const EASEIN = require('eases/quad-in')
const EASEOUT = require('eases/quint-out')
const PP = require('../../paper-pictures')
const URN = require('../../urn')
const { Box } = require('../../box-classes')
const { drawRect, ImageDrawer } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

// const notes = [
//   '“In November 2017, a coalition of human rights groups published a list of 33,293 people who had died since 1993 as a result of ‘militarisation, asylum laws, detention policies and deportations’ in Europe.”',
//
//   '“Where is the server and what is the server saying?”',
//
//   '“surveillance cameras using IBM’s software had been placed strategically across the campus to capture potential security threats, such as car robberies or student protests”',
//
//   '“ren rou sousuo, or ‘human flesh search engine,’ in which web users collaborate to discover the identity of a specific individual or organisation”',
//
//   '“People who view their health as excellent are more likely to vote.”',
//
//   '“…garbage can puddle; melted guns on a platter; cars bleeding aluminum; pile of tire wire. Is this really where I lived, where I raised my children? Where did their beds go? Their bedrooms?”',
//
//   '“Powell believed that for neoliberalism to succeed in Britain, the working class would have to be more loyal to the nation-state than it was to its own interests.”',
//
//   '“You are making us tell these stories instead of all the other, better ones we could tell.”',
//
//   '“Her Rube Goldberg is made out of humans.”',
//
//   '“You were in a field, an unidentified country, and all the lines were illuminated and lifted out of the ground.”',
//
//   '“State Parties, in their strategies and policies, ‘should identify appropriate indicators and benchmarks, including disaggregated statistics and time frames that allow them to monitor effectively the implementation of the right of everyone to take part in cultural life.’”'
// ]

module.exports = async function sketch ({ width, height, duration }) {
  const fullDuration = 160
  const pictures = await PP() // prime paper pictures cache
  const randomPicture = new URN(pictures, { autoReset: true })
  const frames = fullDuration * 24
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
  const frameTop = 224 / 1080 * height
  const frameHeight = height - frameTop
  const frameBox = new Box([0, frameTop, width, frameHeight])

  return async (
    { context: ctx, time, frame, fps, duration, Image }
  ) => {
    const playhead = time / fullDuration

    // draw black base
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    // draw pulsing base colour layer
    const alphaCycle = 1.5
    ctx.globalAlpha = EASEIN(LERP(0, 1, WRAP(time, 0, alphaCycle) / alphaCycle))
    const colorIndex = Math.floor(time / alphaCycle) % colors.length
    drawRect(ctx, ...frameBox, { background: colors[colorIndex] })

    // draw initial white blank slate
    const blankSlateAlpha = lerpPoints([
      [0, 1],
      [3, 1],
      [11, 0.7],
      [20, 1],
      // [30, 0.5],
      [39, 0.7],
      [49, 0.2],
      // [60, 0.333],
      [64, 1],
      [75, 1],
      // [75, 0.083],
      [80, 0]
    ], time, { easing: 'quad-in' })
    ctx.globalAlpha = blankSlateAlpha
    drawRect(ctx, ...frameBox, { background: 'white' })

    const transitionTime = 1 / fps
    const indexPosition = time / transitionTime
    const imagesIndex = CLAMP(Math.floor(indexPosition), 0, images.length - 1)

    const zoom = LERP(15, 8, EASEOUT(playhead))

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'screen'
    for (let i = 0; i < splits; i++) {
      const image = await images[imagesIndex][i].buffer()
      const img = new Image()
      img.onload = ImageDrawer(ctx, img, i * splitWidth, frameTop, { h: frameHeight, w: splitWidth, zoom })
      img.src = image
    }

    // ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = blankSlateAlpha
    drawRect(ctx, ...frameBox, { background: pink })

    // if (rangesIncludeValue([[0, duration], [5, 7], [11, 13], [14, 16], [19, 21]], time)) {
    //   ctx.globalCompositeOperation = 'source-over'
    //   const textIndex = Math.floor(lerpPoints([[0, 0], [duration, 10]], time))
    //   drawPara(ctx, notes[textIndex], width / 2, height / 2, {
    //     measure: width - height * 0.05,
    //     maxHeight: height * 0.9,
    //     align: 'center',
    //     verticalAlign: 'middle',
    //     baseline: 'top',
    //     size: 90,
    //     color: 'black'
    //   })
    // }
  }
}
