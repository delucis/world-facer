const VLDT = require('@delucis/aproba')

class Size {
  constructor (size) {
    VLDT('ANN', [size, ...size]);
    [this.width, this.height] = size
    this.box = () => new Box(this.toArray())
    this.area = () => this.width * this.height
    this.toArray = () => [this.width, this.height]
  }
}

class Box {
  constructor (box) {
    VLDT('ANN|ANNNN', [box, ...box])
    if (box.length === 2) {
      box = [0, 0, ...box]
    }
    [this.x, this.y, this.width, this.height] = box
    this.size = () => new Size([this.width, this.height])
    this.area = () => this.size().area()
    this.toArray = () => [this.x, this.y, this.width, this.height]
  }
}

module.exports = {
  Size,
  Box
}
