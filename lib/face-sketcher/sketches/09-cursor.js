const RANDOM = require('canvas-sketch-util/random')
const { drawLine, drawRect, blurRect } = require('../../canvas-utils')
const { lerpPoints } = require('../../sketch-utils')

module.exports = async function sketch ({ width, height }) {
  const pad = 40
  const vPad = 351
  const vCenter = height / 2
  const right = width - pad
  const bottom = height - vPad
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

    const flicker = RANDOM.weightedSet(flickerSet)
    ctx.globalAlpha = flicker

    drawLine(
      ctx,
      [
        [pad, lerpPoints([[0, vPad], [1, vCenter]], playhead)],
        [right, vCenter],
        [pad, lerpPoints([[0, bottom], [1, vCenter]], playhead)]
      ],
      { color: 'red', lineWidth: flicker + 1 }
    )

    blurRect(ctx, pad, vPad, width - 2 * pad, height - 2 * vPad, (1 - flicker) * 10)
  }
}
