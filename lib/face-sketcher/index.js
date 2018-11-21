const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const flickerSketch = require('./sketches/00-fast-flickering-w-text')
const slowMover = require('./sketches/01-slow-mover.js')
const slowGlimpse = require('./sketches/01a-slow-glimpse.js')
const section3Background = require('./sketches/03-background-stripe')
const section4 = require('./sketches/04-i-began-the-day')
const section5 = require('./sketches/05-first-words')
// const section10 = require('./sketches/10-horizon-line')
const section12 = require('./sketches/12-split-screens')

const sketches = [
  flickerSketch, slowMover, slowGlimpse, section3Background, section4, section5, null, null, null, null, slowGlimpse, null, section12
]

const durations = [12, 50, 20, 15, 60, 12, null, null, null, null, 20, null, 20]

const blurSettings = [
  {},
  { samplesPerFrame: 10, shutterAngle: 2 },
  { samplesPerFrame: 10, shutterAngle: 2 },
  { section: 3 },
  { section: 4, samplesPerFrame: 4 },
  { section: 5, samplesPerFrame: 4 },
  {},
  {},
  {},
  {},
  { section: 10, samplesPerFrame: 10, shutterAngle: 2 },
  {},
  { section: 12 }
]

const sketch = 10

const settings = {
  dimensions: [ 1920, 1080 ],
  duration: durations[sketch],
  fps: 24,
  outDir: 'build/face-sketcher',
  filename: format(new Date(), 'YYYYMMDD-HHmmss') + '.mp4',
  renderInParallel: true,
  motionBlur: blurSettings[sketch]
}

PELLICOLA(sketches[sketch], settings)
  .catch(console.error)
