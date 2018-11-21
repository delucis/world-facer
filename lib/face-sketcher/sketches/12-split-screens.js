const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP, linspace: LINSPACE } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const URN = require('../../urn')
const { Size, Box } = require('../../box-classes')
const { drawRect, drawPara } = require('../../canvas-utils')
const { rangesIncludeValue, lerpPoints } = require('../../sketch-utils')

const notes = [
  '“In November 2017, a coalition of human rights groups published a list of 33,293 people who had died since 1993 as a result of ‘militarisation, asylum laws, detention policies and deportations’ in Europe.”',

  '“Where is the server and what is the server saying?”',

  '“surveillance cameras using IBM’s software had been placed strategically across the campus to capture potential security threats, such as car robberies or student protests”',

  '“ren rou sousuo, or ‘human flesh search engine,’ in which web users collaborate to discover the identity of a specific individual or organisation”',

  '“People who view their health as excellent are more likely to vote.”',

  '“…garbage can puddle; melted guns on a platter; cars bleeding aluminum; pile of tire wire. Is this really where I lived, where I raised my children? Where did their beds go? Their bedrooms?”',

  '“Powell believed that for neoliberalism to succeed in Britain, the working class would have to be more loyal to the nation-state than it was to its own interests.”',

  '“You are making us tell these stories instead of all the other, better ones we could tell.”',

  '“Her Rube Goldberg is made out of humans.”',

  '“You were in a field, an unidentified country, and all the lines were illuminated and lifted out of the ground.”',

  '“State Parties, in their strategies and policies, ‘should identify appropriate indicators and benchmarks, including disaggregated statistics and time frames that allow them to monitor effectively the implementation of the right of everyone to take part in cultural life.’”'
]

function ImageDrawer (ctx, img, { zoom = 13, x = 0, y = 0, w = 20, h = 20 } = {}) {
  return () => {
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([w, h])
    const targetBox = imgBox.cropped(targetSize).zoom(zoom)
    ctx.drawImage(img, ...targetBox, x, y, ...targetSize)
  }
}

module.exports = async function sketch () {
  const dur = 60
  const pictures = await PP() // prime paper pictures cache
  const randomPicture = new URN(pictures)
  const frames = dur * 24
  const splits = 5
  const images = new Array(frames)
  for (let i = 0; i < frames && !randomPicture.done; i++) {
    images[i] = []
    for (let j = 0; j < splits; j++) {
      let pic
      if (RANDOM.chance(3 / 4) || i === 0) {
        pic = randomPicture.next()
      } else {
        pic = images[i - 1][j]
      }
      images[i].push(pic)
    }
  }

  const zoomPoints = LINSPACE(dur / 0.2).map(i => [i * dur, RANDOM.range(3, 11)])

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const transitionTime = 1 / fps
    const indexPosition = time / transitionTime
    const imagesIndex = CLAMP(Math.floor(indexPosition), 0, images.length)

    const zoom = lerpPoints(zoomPoints, time, { smooth: true })

    for (let i = 0; i < splits; i++) {
      const splitWidth = width / splits
      const image = await images[imagesIndex][i].buffer()
      const img = new Image()
      img.onload = ImageDrawer(ctx, img, { x: i * splitWidth, h: height, w: splitWidth, zoom })
      img.src = image
    }

    if (rangesIncludeValue([[0, duration], [5, 7], [11, 13], [14, 16], [19, 21]], time)) {
      ctx.globalAlpha = 0.5
      drawRect(ctx, 0, 0, width, height, { background: '#ffb7ed' })
      ctx.globalAlpha = 1
      const textIndex = Math.floor(lerpPoints([[0, 0], [duration, 10]], time))
      drawPara(ctx, notes[textIndex], width / 2, height / 2, {
        measure: width - height * 0.05,
        maxHeight: height * 0.9,
        align: 'center',
        verticalAlign: 'middle',
        baseline: 'top',
        size: 90,
        color: 'white'
      })
    }
  }
}
