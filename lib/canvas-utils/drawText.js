const VLDT = require('@delucis/aproba')
const coerce = require('./coerce')
const { Box } = require('../box-classes')
const drawRect = require('./drawRect')

function drawText (
  ctx, text, x, y,
  {
    style, variant, weight, stretch, baseline, background, padding, borderColor, borderWidth,
    minWidth = 0,
    size = 67.5,
    font = 'GT Cinetype Trial',
    color = '#ffb7ed',
    align = 'center'
  } = {}
) {
  VLDT('OSNN|OSNNO', arguments)

  style = coerce.style(style)
  variant = coerce.variant(variant)
  weight = coerce.weight(weight)
  stretch = coerce.stretch(stretch)
  baseline = coerce.baseline(baseline)
  background = coerce.background(background)
  size = coerce.size(size)
  color = coerce.color(color)
  align = coerce.align(align)

  ctx.textAlign = align
  ctx.font = `${style} ${variant} ${weight} ${stretch} ${size}px "${font}"`
  ctx.textBaseline = baseline

  const metrics = ctx.measureText(text)
  const bgW = metrics.width
  const bgH = metrics.emHeightAscent + metrics.emHeightDescent
  const bgBox = new Box([x, y, Math.max(bgW, minWidth), bgH])
    .translate([-Math.max(bgW, minWidth) / 2, -metrics.emHeightAscent])

  drawRect(ctx, ...bgBox, { background, padding, minWidth })

  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}

module.exports = drawText
