const RANDOM = require('canvas-sketch-util/random')
const { drawLine, drawRect, blurRect } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch ({ width, height }) {
  const hPad = 160
  const vPad = 351
  const vCenter = height / 2
  const right = width - hPad
  const bottom = height - vPad
  const lineWidth = width - 2 * hPad
  const flickerSet = [
    { value: 1, weight: 5 },
    { value: 0.8, weight: 70 },
    { value: 0.7, weight: 8 },
    { value: 0.6, weight: 4 },
    { value: 0.5, weight: 4 },
    { value: 0.35, weight: 3 },
    { value: 0.2, weight: 3 },
    { value: 0, weight: 3 }
  ]

  return async function render ({ context: ctx, playhead }) {
    drawRect(ctx, 0, 0, width, height, { background: 'black' })

    const lineTop = lerpPoints([[0, vPad], [1, vCenter]], playhead)
    const lineBottom = lerpPoints([[0, bottom], [1, vCenter]], playhead)
    const lineHeight = lineBottom - lineTop
    const hue = lerpPoints([[0, 0], [1, 305]], playhead)
    const flicker = RANDOM.weightedSet(flickerSet)
    const brightness = flicker * 80

    drawLine(
      ctx,
      [[hPad, lineTop], [right, vCenter], [hPad, lineBottom]],
      { color: `hsl(${hue}, 100%, ${brightness}%)`, lineWidth: flicker + 1 }
    )

    blurRect(ctx, hPad, lineTop, lineWidth, lineHeight, (1 - flicker) * 10)
  }
}
