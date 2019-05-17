const VLDT = require('@delucis/aproba')
const { Line } = require('../box-classes')
const coerce = require('./coerce')

module.exports = drawLine

function drawLine (
  ctx, line,
  { background,
    color,
    lineWidth,
    lineJoin = 'round',
    lineCap = 'round',
    closed = false
  } = {}
) {
  VLDT('OA|OAO', arguments)
  line = new Line(line)
  background = coerce.background(background)

  // create path
  ctx.beginPath();
  [...line].forEach(p => {
    ctx.lineTo(...p)
  })
  if (closed) ctx.closePath()

  // draw path
  ctx.strokeStyle = coerce.borderColor(color)
  ctx.lineWidth = coerce.borderWidth(lineWidth)
  ctx.lineJoin = lineJoin
  ctx.lineCap = lineCap
  ctx.stroke()

  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fill()
  }
}
