const VLDT = require('@delucis/aproba')
const { getIterator } = require('../lang')

class Vector {
  constructor (vector) {
    VLDT('|A|O', arguments)
    if (!vector) {
      vector = [0, 0]
    } else if (!Array.isArray(vector) && !(vector instanceof Vector)) {
      throw new TypeError('Expected Array or Vector, got other object')
    }
    VLDT('NN', [...vector]);
    [this.x, this.y] = [...vector]
  }

  translate (vector) {
    vector = new Vector(vector)
    this.x += vector.x
    this.y += vector.y
    return this
  }

  translated (vector) { return this.clone().translate(vector) }

  clone () { return new Vector(this.toArray()) }

  toArray () { return [this.x, this.y] }

  [Symbol.iterator] () {
    return getIterator(this.toArray())
  }
}

module.exports = Vector
