const PATH = require('path')
const VLDT = require('@delucis/aproba')
const { spawn } = require('child_process')
const GG = require('gauge')
const PP = require('../paper-pictures')
const C = require('../console')

const picturesDir = PATH.resolve(__dirname, '../../data/paper-pictures')

module.exports = async function generateThumbnails () {
  const pictures = await PP()
  const toDo = pictures.length
  const gauge = new GG()
  let done = 0
  C.l()
  gauge.show('Generating thumbnails')
  await makeThumbs(pictures, () => {
    done++
    gauge.show({ completed: done / toDo })
    gauge.pulse(`${(done / toDo * 100).toFixed(2)}% (${done}/${toDo})`)
  })
  gauge.hide()
  C.log(`Generated ${toDo} thumbnails`)
}

async function makeThumbs (images, cb, { batchSize = 8 } = {}) {
  const doNow = images.slice(0, batchSize)
  const doLater = images.slice(batchSize)
  await Promise.all(doNow.map(pic => makeThumb(pic, cb)))
  if (doLater.length) await makeThumbs(doLater, cb, { batchSize })
}

function makeThumb (img, cb) {
  VLDT('OF', arguments)
  return new Promise(function (resolve, reject) {
    const dir = PATH.join(picturesDir, img.dir)
    const src = PATH.join(dir, img.filename + '[0]')
    const out = PATH.join(dir, 'thumb.png')
    const magick = spawn('magick', [
      src,
      '-resize', '48x28^',
      '-gravity', 'center',
      '-crop', '32x18+0+0',
      out
    ])
    magick.on('error', err => reject(err))
    magick.on('close', code => {
      if (code !== 0) {
        reject(new Error(`magick exited with the non-zero code of ${code}`))
      }
      cb()
      resolve()
    })
  })
}
