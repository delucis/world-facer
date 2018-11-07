const easeIn = require('eases/quad-in')
const PP = require('../../paper-pictures')
const URN = require('../../urn')
const { Size, Box } = require('../../box-classes')
// const { lerp } = require('canvas-sketch-util/math')

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
  const paperPictures = await PP()
  const pictures = new URN(paperPictures)
  let image1, image2

  return async (
    { context: ctx, time, duration, playhead, Image }
  ) => {
    const transitionTime = 6
    if (time % transitionTime === 0) {
      image1 = image2 || await pictures.next().buffer()
      image2 = await pictures.next().buffer()
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
