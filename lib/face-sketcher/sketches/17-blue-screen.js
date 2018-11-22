const { drawRect } = require('../../canvas-utils')

module.exports = () => ({ context: ctx, width, height }) => {
  drawRect(ctx, 0, 0, width, height, { background: '#00f' })
}
