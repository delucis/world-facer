const VLDT = require('@delucis/aproba')
const PATH = require('path')
const MKDIR = require('make-dir')
const GG = require('gauge')
const SAY = require('../say')

const cues = [
]

async function saveCues (cues) {
  VLDT('A', arguments)
  const gauge = new GG()
  gauge.done = 0
  gauge.update = (increment = true) => {
    if (increment) gauge.done++
    gauge.show(`Generating spoken cues ${gauge.done}/${cues.length}`, gauge.done / cues.length)
    gauge.pulse()
  }
  gauge.update(false)
  await Promise.all(cues.map(async ([s, { path, rate, voice } = {}]) => {
    path = PATH.join(__dirname, '../../build/cue-speaker', `${path}.aiff`)
    await MKDIR(PATH.dirname(path))
    await SAY(s, { path, rate, voice })
    gauge.update()
  }))
  gauge.hide()
}

saveCues(cues)
