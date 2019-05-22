const { lerpPoints } = require('../../sketch-utils')
const { Box } = require('../../box-classes')
const { drawRect } = require('../../canvas-utils')

module.exports = ({ width, height }) => {
  const frameTop = 351 / 1080 * height
  const frameHeight = height - frameTop
  const frameBox = new Box([0, frameTop, width, frameHeight])
  const gradientPoints = [1, Math.round(height - 0.3 * frameHeight), 1, height]

  return ({ context: ctx, time }) => {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    const h = lerpPoints([[6, 240], [66, 320]], time, { easing: 'circIn' })
    const bottomHue = lerpPoints([[6, 240], [66, 320]], time, { easing: 'cubicInOut' })
    const l = lerpPoints([[6, 50], [72, 0]], time, { easing: 'sineInOut' })

    drawRect(ctx, ...frameBox, { background: `hsla(${h}, 100%, ${l}%, 1)` })

    const gradient = ctx.createLinearGradient(...gradientPoints)
    gradient.addColorStop(0, `hsl(${h}, 100%, ${l}%)`)
    gradient.addColorStop(1, `hsl(${bottomHue}, 100%, ${l}%)`)

    drawRect(ctx, 0, height - 0.3 * frameHeight, width, 0.3 * frameHeight, { background: gradient })
  }
}
