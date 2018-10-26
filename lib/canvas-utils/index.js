const VLDT = require('aproba')

module.exports = {
  fit ([w, h], [maxW, maxH = maxW]) {
    VLDT('NNNN', [w, h, maxW, maxH])
    const factor = Math.min(1, maxW / w, maxH / h)
    return [w * factor, h * factor]
  },

  crop ([w, h], aspectRatio = 1.33) {
    VLDT('NNN', [w, h, aspectRatio])
    const currentAspect = w / h

    if (currentAspect === aspectRatio) {
      return [w, h]
    } else if (currentAspect < aspectRatio) {
      return [w, w / aspectRatio]
    } else {
      return [h * aspectRatio, h]
    }
  }
}
