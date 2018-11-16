const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const flickerSketch = require('./sketches/00-fast-flickering-w-text')
const slowMover = require('./sketches/01-slow-mover.js')
const slowGlimpse = require('./sketches/01a-slow-glimpse.js')
const section3Background = require('./sketches/03-background-stripe')
const section4 = require('./sketches/04-i-began-the-day')

const sketches = [
  flickerSketch, slowMover, slowGlimpse, section3Background, section4
]

const durations = [12, 50, 20, 15, 10]

const blurSettings = [
  {},
  { samplesPerFrame: 10, shutterAngle: 2 },
  { samplesPerFrame: 10, shutterAngle: 2 },
  {},
  {}
]

const sketch = 4

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
