const VLDT = require('@delucis/aproba')
const { getIterator } = require('../lang')

class Point {
  constructor (point) {
    VLDT('|A|O', arguments)
    if (!point) {
      point = [0, 0]
    } else if (!Array.isArray(point) && !(point instanceof Point)) {
      throw new TypeError('Expected Array or Point, got other object')
    }
    VLDT('NN', [...point]);
    [this.x, this.y] = [...point]
  }

  translate (point) {
    point = new Point(point)
    this.x += point.x
    this.y += point.y
    return this
  }

  translated (point) { return this.clone().translate(point) }

  clone () { return new Point(this.toArray()) }

  toArray () { return [this.x, this.y] }

  [Symbol.iterator] () {
    return getIterator(this.toArray())
  }
}

module.exports = Point
