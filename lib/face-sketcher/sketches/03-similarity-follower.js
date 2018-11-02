const RANDOM = require('canvas-sketch-util/random')
const SM = require('../../similarity-matrix')

const sm = new SM()
sm.load('data/similarity-matrix/20181101-133417-size[300].json')

module.exports = function sketch () {
  const follower = sm.follower(RANDOM.rangeFloor(sm.keys.length - 1))
  const images = [...follower.visited]
  console.log(images)
  return async ({context: ctx, width, height, playhead, Image}) => {
    const index = Math.floor(playhead * images.length * 0.999)
    const picture = await sm.getImage(images[index])
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
    }
    img.src = await picture.buffer()
  }
}
