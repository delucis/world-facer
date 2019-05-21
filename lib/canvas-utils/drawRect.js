const VLDT = require('@delucis/aproba')
const CSSBox = require('./CSSBox')
const PaddingBox = require('./PaddingBox')
const coerce = require('./coerce')

module.exports = drawRect

function drawRect (
  ctx, x, y, w, h,
  {
    background,
    borderColor = 'transparent',
    borderWidth = 0,
    minWidth = 0,
    padding = 0
  } = {}
) {
  VLDT('ONNNN|ONNNNO', arguments)

  background = typeof background === 'object' ? background : coerce.background(background)
  borderColor = new CSSBox(borderColor).coerce(coerce.borderColor)
  borderWidth = new CSSBox(borderWidth).coerce(coerce.borderWidth)
  padding = new PaddingBox(padding)

  const rectBox = padding.pad([x, y, Math.max(w, minWidth), h])

  ctx.fillStyle = background
  ctx.fillRect(...rectBox)

  if (borderWidth) {
    ctx.strokeStyle = borderColor.top
    ctx.lineWidth = borderWidth.top
    ctx.strokeRect(...rectBox)
  }
}
