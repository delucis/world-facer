const VLDT = require('@delucis/aproba')

module.exports = {
  fit,
  truncate,
  cropBox
}

/**
 * Get size1 scaled down to fit within size2
 * @param  {Number[]} size1 Tuple of [w, h] for the size to scale
 * @param  {Number[]} size2 Tuple of [maxW, maxH] for the size to fit in
 * @return {Number[]} A tuple of [width, height] for the scaled size
 */
function fit ([w, h], [maxW, maxH]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const factor = Math.min(1, maxW / w, maxH / h)
  return [w * factor, h * factor]
}

/**
 * Truncate the height or width of a size so it matches a given aspect ratio
 * @param  {Number[]} size        Tuple of [w, h] for the box to scale
 * @param  {Number}   aspectRatio Aspect ratio (w/h) to truncate to
 * @return {Number[]} A tuple of [width, height] for the truncated size
 */
function truncate ([w, h], aspectRatio) {
  VLDT('NNN', [w, h, aspectRatio])
  return [Math.min(w, aspectRatio * h), Math.min(h, w / aspectRatio)]
}

/**
 * Get a crop box to use with a canvas context’s drawImage method
 * @param  {Number[]} size1 Tuple of [w, h] for the size to scale
 * @param  {Number[]} size2 Tuple of [maxW, maxH] for the size to fit in
 * @return {Number[]} Quadruple of [x, y, width, height] for box to crop to
 */
function cropBox ([w, h], [maxW, maxH]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const [sw, sh] = truncate([w, h], maxW / maxH)
  return [(w - sw) / 2, (h - sh) / 2, sw, sh]
}
