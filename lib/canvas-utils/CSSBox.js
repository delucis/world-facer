const VLDT = require('@delucis/aproba')
const { getIterator } = require('../lang')

class CSSBox {
  constructor (box) {
    VLDT('S|N|A', arguments)
    if (typeof box === 'number' || typeof box === 'string') {
      box = Array(4).fill(box)
    } else if (Array.isArray(box)) {
      if (box.length >= 4) {
        box = box.slice(0, 4)
      } else if (box.length === 3) {
        box = [...box, box[1]]
      } else if (box.length === 2) {
        box = [...box, ...box]
      } else if (box.length === 1) {
        box = Array(4).fill(box[0])
      } else {
        box = Array(4).fill(0)
      }
    } else {
      box = Array(4).fill(0)
    }
    [this.top, this.right, this.bottom, this.left] = box
  }

  coerce (coercer) {
    VLDT('F', arguments);
    [this.top, this.right, this.bottom, this.left] = [...this].map(coercer)
    return this
  }

  coerced (coercer) {
    VLDT('F', arguments)
    return this.clone().coerce(coercer)
  }

  clone () { return new CSSBox(...this) }

  toArray () { return [this.top, this.right, this.bottom, this.left] }

  [Symbol.iterator] () {
    return getIterator(this.toArray())
  }
}

module.exports = CSSBox
