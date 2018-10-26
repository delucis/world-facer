const VLDT = require('@delucis/aproba')

module.exports = {
  fit ([w, h], [maxW, maxH = maxW]) {
    VLDT('NNNN', [w, h, maxW, maxH])
    const factor = Math.min(1, maxW / w, maxH / h)
    return [w * factor, h * factor]
  },

  truncate ([w, h], aspectRatio = 1.33) {
    VLDT('NNN', [w, h, aspectRatio])
    return [Math.min(w, aspectRatio * h), Math.min(h, w / aspectRatio)]
  }
}
