const VLDT = require('@delucis/aproba')
const { getIterator } = require('../lang')
const { isInteger } = require('../validators')
const Point = require('./Point')

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
        box = [...new Point(), ...box]
      }
    } else if (box.length === 2) {
      box = [...new Point(), ...box]
    }

    VLDT('NNNN', [...box])

    super([...box].slice(2, 4));
    [this.x, this.y] = [...box]
  }

  size () { return new Size([this.width, this.height]) }

  position () { return new Point([this.x, this.y]) }

  round () {
    if (isInteger(this.x) && isInteger(this.y) && isInteger(this.width) && isInteger(this.height)) {
      return this
    }
    const [x, y, w, h] = [...this]
    this.x = Math.floor(x)
    this.y = Math.floor(y)
    this.width = Math.ceil(x + w) - this.x
    this.height = Math.ceil(y + h) - this.y
    return this
  }

  rounded () { return this.clone().round() }

  translate (point) {
    point = new Point(point);
    [this.x, this.y] = this.position().translate(point)
    return this
  }

  translated (point) { return this.clone().translate(point) }

  crop (max) {
    max = new Size(max)
    const { width, height } = this
    this.truncate(max.aspectRatio())
    this.translate([(width - this.width) / 2, (height - this.height) / 2])
    return this
  }

  cropped (max) { return this.clone().crop(max) }

  zoom (zoom) {
    VLDT('N', arguments)
    const { width, height } = this
    this.scale(1 / zoom)
    this.translate([(width - this.width) / 2, (height - this.height) / 2])
    return this
  }

  zoomed (zoom) { return this.clone().zoom(zoom) }

  clone () { return new Box(this.toArray()) }
  toArray () { return [this.x, this.y, this.width, this.height] }
}

class Line {
  constructor (line) {
    VLDT('|A|O', arguments)
    if (!line) {
      line = []
    } else if (!Array.isArray(line) && !(line instanceof Line)) {
      throw new TypeError('Expected Array or Line, got other object')
    }
    line = [...line].map(point => new Point(point))
    this.points = line
  }

  join (line) {
    line = new Line(line)
    this.points = this.points.concat(line.points)
    return this
  }

  joined (line) { return this.clone().join(line) }

  translate (point) {
    point = new Point(point)
    this.points.forEach(p => p.translate(point))
    return this
  }

  translated (point) { return this.clone().translate(point) }

  box () {
    if (!this.points.length) return new Box([0, 0])
    const [x, y] = this.points.reduce((coords, { x, y }) => {
      coords[0].push(x)
      coords[1].push(y)
      return coords
    }, [[], []])
    const top = Math.min(...y)
    const bottom = Math.max(...y)
    const left = Math.min(...x)
    const right = Math.max(...x)
    return new Box([left, top, right - left, bottom - top])
  }

  clone () { return new Line(this.toArray()) }

  toArray () { return this.points.map(p => [...p]) }

  [Symbol.iterator] () {
    return getIterator(this.toArray())
  }
}

module.exports = {
  Point,
  Line,
  Size,
  Box
}
