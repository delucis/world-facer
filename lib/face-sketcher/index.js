const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const PW = require('../paper-words')
const PP = require('../paper-pictures')
const L = require('../lang')
const { Size, Box } = require('../box-classes')
const { drawText } = require('../canvas-utils')
const URN = require('../urn')

const settings = {
  dimensions: [ 1920, 1080 ],
  duration: 12,
  fps: 24,
  outDir: 'build/face-sketcher',
  filename: format(new Date(), 'YYYYMMDD-HHmmss') + '.mp4'
}

const sketch = async () => {
  const [ paperPictures, titles ] = await Promise.all([PP(), PW.titles()])
  const pictures = new URN(paperPictures)
  const sentences = new URN(titles.split('\n'))

  const getSentence = () => L.getIterator(sentences.next().split(/\s+/))

  const wordWriter = () => {
    let sentence = getSentence()
    let text
    return (x, y, { ctx, frame, frameInterval, frameOffset = 0 }) => {
      if (frame % frameInterval === 0 || !text) {
        text = sentence.next()
      }
      if (text.done) {
        sentence = getSentence()
        return
      }
      if (text.value) {
        drawText(ctx, text.value, x, y, { color: '#fff', background: '#ffb7ed', padding: [8, 22], minWidth: 360 })
      }
    }
  }

  const frameInterval = 4
  const writeWord1 = wordWriter()
  const writeWord2 = wordWriter()
  const writeWord3 = wordWriter()
  const writeWord4 = wordWriter()

  return async ({ context: ctx, width, height, time, frame, playhead, Image }) => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    const picture = pictures.next()
    const img = new Image()
    img.onload = () => {
      const imgBox = new Box([img.width, img.height])
      const targetSize = new Size([width, height])
      const targetBox = imgBox.cropped(targetSize).zoom(2 + playhead * 13)
      const [dX, dY] = [0, 0] // [width * 0.75 - w / 2, height * 0.5 - h / 2]
      ctx.drawImage(img, ...targetBox, dX, dY, ...targetSize)
    }
    img.src = await picture.buffer()

    writeWord1(width * 0.25, height * 0.5, {ctx, frame, frameInterval})
    writeWord2(width * 0.75, height * 0.5, {ctx, frame, frameInterval})
    writeWord3(width * 0.5, height * 0.25, {ctx, frame, frameInterval})
    writeWord4(width * 0.5, height * 0.75, {ctx, frame, frameInterval})
  }
}

PELLICOLA(sketch, settings)
