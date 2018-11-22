const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const flickerSketch = require('./sketches/00-fast-flickering-w-text')
const slowMover = require('./sketches/01-slow-mover.js')
const slowGlimpse = require('./sketches/01a-slow-glimpse.js')
const section3Background = require('./sketches/03-background-stripe')
const section4 = require('./sketches/04-i-began-the-day')
const section5 = require('./sketches/05-first-words')
const section11a = require('./sketches/11a-glimpse-flickerer')
const section11b = require('./sketches/11b-glimpse-flickerer')
const section12 = require('./sketches/12-word-cloud')
const section16 = require('./sketches/16-split-screens')
const section17 = require('./sketches/17-blue-screen')

const sketches = [
  flickerSketch, slowMover, slowGlimpse, section3Background, section4, section5, null, null, null, null, section11a, section11b, section12, null, null, null, section16, section17
]

const durations = [12, 50, 20, 15, 60, 12, null, null, null, null, 11, 15, 52, null, null, null, 160, 3]

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
  { section: '11a', samplesPerFrame: 10, shutterAngle: 2 },
  { section: '11b', samplesPerFrame: 10, shutterAngle: 2 },
  { section: 12, samplesPerFrame: 10, shutterAngle: 2 },
  {},
  {},
  {},
  { section: 16 },
  { section: 17 }
]

const sketch = parseInt(process.argv[2] || '0')
if (!sketches[sketch]) {
  console.error(`Sketch ${sketch} not found`)
  process.exit(1)
}

let dimensions = [ 1920, 1080 ]
if (process.argv[3] === 'sm') {
  dimensions = dimensions.map(d => d / 3)
}

const settings = {
  dimensions,
  duration: durations[sketch],
  fps: 24,
  outDir: 'build/face-sketcher',
  filename: format(new Date(), 'YYYYMMDD-HHmmss') + '.mp4',
  renderInParallel: true,
  motionBlur: blurSettings[sketch],
  maxConcurrency: blurSettings[sketch].samplesPerFrame ? Math.max(Math.floor(16 / blurSettings[sketch].samplesPerFrame), 1) : 16
}

PELLICOLA(sketches[sketch], settings)
  .catch(console.error)
