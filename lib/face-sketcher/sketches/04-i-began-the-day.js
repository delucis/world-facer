const EASE = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const { clamp: CLAMP } = require('canvas-sketch-util/math')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const { Size, Box } = require('../../box-classes')
const { drawRect, drawText } = require('../../canvas-utils')
const { rangesIncludeValue } = require('../../sketch-utils')

function ImageDrawer (ctx, img, { zoom = 13, h = 20 } = {}) {
  return () => {
    const { width, height } = ctx.canvas
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([width, h])
    const targetBox = imgBox.cropped(targetSize).zoom(zoom)
    ctx.drawImage(img, ...targetBox, 0, height / 2 - targetSize.height / 2, ...targetSize)
  }
}

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const slowStart = RANDOM.rangeFloor(sm.keys.length)
  const images = await sm.follower({ start: slowStart }).images()
  const burstStart = RANDOM.rangeFloor(sm.keys.length)
  const burst = await sm.follower({ start: burstStart }).images()
  console.log(`Starting main sequence on ${slowStart}`)
  console.log(`Starting burst on ${burstStart}`)
  const text = [
    '', '', '', '', 'I', 'began', 'the', 'day', 'day', 'inside', 'the', 'world', 'world', 'trying', 'to', 'look', 'at', 'it,', 'it,', 'but', 'it', 'was', 'lying', 'on', 'my', 'face,', 'face,', 'making', 'it', 'hard', 'to', 'see.', 'see.'
  ]

  return async (
    { context: ctx, time, frame, fps, duration, playhead, Image, width, height }
  ) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })
    const aperture = 100
    if (rangesIncludeValue([[4, 4.4]], time)) {
      const index = CLAMP(Math.floor((time - 4) * fps), 0, burst.length - 1)
      const image = await burst[index].buffer()
      const img = new Image()
      img.onload = ImageDrawer(ctx, img, { zoom: 3, h: aperture })
      img.src = image
    } else {
      const transitionTime = 2
      const imageIndex1 = CLAMP(Math.floor(time / transitionTime), 0, images.length - 1)
      const imageIndex2 = CLAMP(imageIndex1 + 1, 0, images.length - 1)
      const image1 = await images[imageIndex1].buffer()
      const image2 = await images[imageIndex2].buffer()
      const img1 = new Image()
      img1.onload = ImageDrawer(ctx, img1, { h: aperture, zoom: 11 })
      img1.src = image1
      ctx.globalAlpha = EASE(time / transitionTime % 1)
      const img2 = new Image()
      img2.onload = ImageDrawer(ctx, img2, { h: aperture, zoom: 11 })
      img2.src = image2
    }
    ctx.globalAlpha = 1
    const wordInterval = 0.25 // new word every n seconds
    const textIndex = Math.floor(time / wordInterval)
    if (typeof text[textIndex] === 'string') {
      drawText(ctx, text[textIndex], width / 2, height / 2, { color: '#ffb7ed', background: '#000', padding: [16, 30], minWidth: 360, align: 'center', baseline: 'middle' })
    }
  }
}
