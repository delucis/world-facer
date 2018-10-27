const VLDT = require('@delucis/aproba')

module.exports = {
  fit,
  truncate,
  cropBox
}

/**
 * Get box1 scaled down to fit within box2
 * @param  {Number[]} box1  Tuple of [w, h] for the box to scale
 * @param  {Number[]} box2  Tuple of [maxW, maxH] for the box to fit in
 * @return {Number[]} A tuple of [width, height] for the scaled box
 */
function fit ([w, h], [maxW, maxH = maxW]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const factor = Math.min(1, maxW / w, maxH / h)
  return [w * factor, h * factor]
}

/**
 * Truncate the height or width of a box so it matches a given aspect ratio
 * @param  {Number[]} box         Tuple of [w, h] for the box to scale
 * @param  {Number}   aspectRatio Aspect ratio (w/h) to truncate to
 * @return {Number[]} A tuple of [width, height] for the truncated box
 */
function truncate ([w, h], aspectRatio) {
  VLDT('NNN', [w, h, aspectRatio])
  return [Math.min(w, aspectRatio * h), Math.min(h, w / aspectRatio)]
}

/**
 * Get a crop box to use with a canvas context’s drawImage method
 * @param  {Number[]} box1  Tuple of [w, h] for the box to scale
 * @param  {Number[]} box2  Tuple of [maxW, maxH] for the box to fit in
 * @return {Number[]} Quadruple of [x, y, width, height] for box to crop to
 */
function cropBox ([w, h], [maxW, maxH = maxW]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const [sw, sh] = truncate([w, h], maxW / maxH)
  return [(w - sw) / 2, (h - sh) / 2, sw, sh]
}
