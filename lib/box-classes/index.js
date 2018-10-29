const VLDT = require('@delucis/aproba')
const { getIterator } = require('../lang')
const Vector = require('./Vector')

class Size {
  constructor (size) {
    VLDT('|A|O', arguments)
    if (!size) {
      size = [0, 0]
    } else if (!Array.isArray(size) && !(size instanceof Size)) {
      throw new TypeError('Expected Array or Size, got other object')
    }
    VLDT('NN', [...size]);
    [this.width, this.height] = [...size]
  }

  box () { return new Box(this.toArray()) }

  area () { return this.width * this.height }

  aspectRatio () { return this.width / this.height }

  scale (factor) {
    this.width *= factor
    this.height *= factor
    return this
  }

  scaled (factor) { return this.clone().scale(factor) }

  fit (size) {
    size = new Size(size)
    return this.scale(
      Math.min(1, size.width / this.width, size.height / this.height)
    )
  }

  fitted (size) { return this.clone().fit(size) }

  truncate (aspectRatio) {
    VLDT('N', arguments)
    this.width = Math.min(this.width, aspectRatio * this.height)
    this.height = Math.min(this.height, this.width / aspectRatio)
    return this
  }

  truncated (aspectRatio) { return this.clone().truncate(aspectRatio) }

  clone () { return new Size(this.toArray()) }

  toArray () { return [this.width, this.height] }

  [Symbol.iterator] () {
    return getIterator(this.toArray())
  }
}

class Box extends Size {
  constructor (box) {
    VLDT('|A|O', arguments)
    box = box || new Size()

    if (!Array.isArray(box)) {
      if (!(box instanceof Size)) {
        throw new TypeError('Expected Array, Size, or Box, got other object')
      }

      if (!(box instanceof Box)) {
        box = [...new Vector(), ...box]
      }
    } else if (box.length === 2) {
      box = [...new Vector(), ...box]
    }

    VLDT('NNNN', [...box])

    super([...box].slice(2, 4));
    [this.x, this.y] = [...box]
  }

  size () { return new Size([this.width, this.height]) }

  position () { return new Vector([this.x, this.y]) }

  crop (max) {
    max = new Size(max)
    const { width, height } = this
    this.truncate(max.aspectRatio())
    this.x = (width - this.width) / 2
    this.y = (height - this.height) / 2
    return this
  }

  cropped (max) { return this.clone().crop(max) }

  zoom (zoom) {
    VLDT('N', arguments)
    const [newW, newH] = this.size().scale(1 / zoom).toArray();
    [this.x, this.y] = this.position().translate([
      (this.width - newW) / 2,
      (this.height - newH) / 2
    ]).toArray()
    this.width = newW
    this.height = newH
    return this
  }

  zoomed (zoom) { return this.clone().zoom(zoom) }

  clone () { return new Box(this.toArray()) }
  toArray () { return [this.x, this.y, this.width, this.height] }
}

module.exports = {
  Vector,
  Size,
  Box
}
