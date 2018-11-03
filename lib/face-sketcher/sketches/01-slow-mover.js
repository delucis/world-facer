const easeIn = require('eases/quad-in')
const RANDOM = require('canvas-sketch-util/random')
const PP = require('../../paper-pictures')
const SM = require('../../similarity-matrix')
const L = require('../../lang')
const { Size, Box } = require('../../box-classes')

function ImageDrawer (ctx, img) {
  return () => {
    const { width, height } = ctx.canvas
    const imgBox = new Box([img.width, img.height])
    const targetSize = new Size([width, height])
    const targetBox = imgBox.cropped(targetSize).zoom(13)
    ctx.drawImage(img, ...targetBox, 0, 0, ...targetSize)
  }
}

module.exports = async function sketch () {
  await PP() // prime paper pictures cache
  const sm = new SM()
  await sm.load('data/similarity-matrix/00000000-latest.json')
  const pictures = await sm.follower({ start: RANDOM.rangeFloor(sm.keys.length) }).images()
  console.log(pictures)
  const indexes = L.getIterator(pictures.length)
  let image1, image2

  return async (
    { context: ctx, time, duration, playhead, Image }
  ) => {
    const transitionTime = 2
    if (time % transitionTime === 0) {
      image1 = image2 || await pictures[indexes.next()].buffer()
      image2 = await pictures[indexes.next()].buffer()
    }
    const img1 = new Image()
    img1.onload = ImageDrawer(ctx, img1)
    img1.src = image1
    ctx.globalAlpha = easeIn(playhead * duration / transitionTime % 1)
    const img2 = new Image()
    img2.onload = ImageDrawer(ctx, img2)
    img2.src = image2
  }
}
