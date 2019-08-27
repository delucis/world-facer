const VLDT = require('@delucis/aproba')
const RANDOM = require('canvas-sketch-util/random')
const L = require('../lang')

class URN {
  constructor (src, { autoReset = false, seed } = {}) {
    VLDT('N|A|C|NO|AO|CO', arguments)
    VLDT('B', [autoReset])

    const size = typeof src === 'number' ? src : src instanceof Set ? src.size : src.length
    if (size < 1) throw new RangeError(`URN: size must be > 0, got ${size}`)

    if (typeof src === 'number') {
      src = new Array(src).fill().map((_, idx) => idx)
    } else if (src instanceof Set) {
      src = [...src]
    }

    let generator

    this.reset = () => {
      const rand = RANDOM.createRandom(seed)
      generator = L.getIterator(rand.shuffle(src))
      this.done = false
    }

    this.next = () => {
      let { value, done } = generator.next()
      if (autoReset && done) {
        this.reset()
        const next = generator.next()
        value = next.value
        done = next.done
      }
      this.done = done
      return done ? undefined : value
    }

    this.reset()
  }
}

module.exports = URN
