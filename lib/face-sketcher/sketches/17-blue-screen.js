const { Box } = require('../../box-classes')
const { drawRect } = require('../../canvas-utils')

module.exports = ({ width, height }) => {
  const frameTop = 351 / 1080 * height
  const frameHeight = height - frameTop
  const frameBox = new Box([0, frameTop, width, frameHeight])

  return ({ context: ctx }) => {
    drawRect(ctx, ...frameBox, { background: '#00f' })
  }
}
