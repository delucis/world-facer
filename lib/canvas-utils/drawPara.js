const VLDT = require('@delucis/aproba')
const coerce = require('./coerce')

/**
 * Given a string and measure length, return an array of lines.
 * @param  {CanvasRenderingContext2D} context
 * @param  {String} [text='']    Text to break into lines
 * @param  {Number} [measure=400] The width within which the text must fit
 * @return {String[]}            An array of lines
 */
function getLines (context, { text = '', measure = 400 } = {}) {
  const words = text.split(' ')
  const p = words.reduce((p, word) => {
    const m = context.measureText(p.nextLine ? `${p.nextLine} ${word}` : word)
    if (m.width > measure) {
      p.lines.push(p.nextLine)
      p.nextLine = ''
    }
    p.nextLine += p.nextLine ? ` ${word}` : word
    return p
  }, { lines: [], nextLine: '' })
  if (p.nextLine) p.lines.push(p.nextLine)
  return p.lines
}

module.exports = function drawParagraph (
  ctx, text, x, y,
  {
    style, variant, weight, stretch, baseline, verticalAlign,
    size = 67.5,
    font = 'GT Cinetype Trial',
    color = '#ffb7ed',
    align = 'center',
    measure = 400,
    lineHeight = 1.5,
    maxHeight = Infinity
  } = {}
) {
  VLDT('OSNN|OSNNO', arguments)

  style = coerce.style(style)
  variant = coerce.variant(variant)
  weight = coerce.weight(weight)
  stretch = coerce.stretch(stretch)
  baseline = coerce.baseline(baseline)
  verticalAlign = coerce.verticalAlign(verticalAlign)
  size = coerce.size(size)
  color = coerce.color(color)
  align = coerce.align(align)

  ctx.textAlign = align
  ctx.font = `${style} ${variant} ${weight} ${stretch} ${size}px "${font}"`
  ctx.textBaseline = baseline
  ctx.fillStyle = color

  const lines = getLines(ctx, { text, measure })
  const { emHeightAscent, emHeightDescent } = ctx.measureText('M')
  const leading = (emHeightAscent + emHeightDescent) * lineHeight
  const maxLines = Math.floor(maxHeight / leading)
  const lineCount = Math.min(lines.length, maxLines)
  switch (verticalAlign) {
    case 'bottom':
      y -= lineCount * leading
      break
    case 'middle':
      y -= lineCount * leading / 2
      break
    case 'top':
    default:
  }

  for (let i = 0; i < lineCount; i++) {
    ctx.fillText(lines[i], x, y + leading * i)
  }
}
