const VLDT = require('@delucis/aproba')

module.exports = {
  fit,
  truncate,
  cropBox
}

function fit ([w, h], [maxW, maxH = maxW]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const factor = Math.min(1, maxW / w, maxH / h)
  return [w * factor, h * factor]
}

function truncate ([w, h], aspectRatio) {
  VLDT('NNN', [w, h, aspectRatio])
  return [Math.min(w, aspectRatio * h), Math.min(h, w / aspectRatio)]
}

function cropBox ([w, h], [maxW, maxH = maxW]) {
  VLDT('NNNN', [w, h, maxW, maxH])
  const [sw, sh] = truncate([w, h], maxW / maxH)
  return [(w - sw) / 2, (h - sh) / 2, sw, sh]
}
