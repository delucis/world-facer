const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const flickerSketch = require('./sketches/00-fast-flickering-w-text')
const slowMover = require('./sketches/01-slow-mover.js')

const sketches = [flickerSketch, slowMover]

const settings = {
  dimensions: [ 1920, 1080 ],
  duration: 36,
  fps: 24,
  outDir: 'build/face-sketcher',
  filename: format(new Date(), 'YYYYMMDD-HHmmss') + '.mp4'
}

PELLICOLA(sketches[1], settings)
  .catch(console.error)
