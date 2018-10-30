const coerce = require('./coerce')
const CSSBox = require('./CSSBox')
const { Box } = require('../box-classes')

class PaddingBox extends CSSBox {
  constructor (box) {
    if (!Array.isArray(box)) {
      box = [box]
    }
    box.map(coerce.padding)
    super(box)
  }

  pad (box) {
    box = new Box(box)
    box.translate([-this.left, -this.top])
    box.width += this.left + this.right
    box.height += this.top + this.bottom
    return box
  }
}

module.exports = PaddingBox
