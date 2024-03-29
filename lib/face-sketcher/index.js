const PELLICOLA = require('pellicola')
const format = require('date-fns/format')
const inquirer = require('inquirer')
const rerequire = require('import-fresh')
const C = require('../console')

function runSketch (n = 0, { small = false } = {}) {
  const sketches = rerequire('./definitions')
  const sketch = sketches[n]

  if (!sketch) {
    C.error('Sketch not found')
    return
  }

  let dimensions = [1920, 1080]
  if (small) {
    dimensions = dimensions.map(d => d / 3)
  }

  const settings = {
    dimensions,
    fps: 24,
    outDir: 'build/face-sketcher',
    filename: `${format(new Date(), 'yyyyMMdd-HHmmss')}-${sketch.sketch}.mp4`,
    renderInParallel: true,
    motionBlur: sketch.blurSettings,
    maxConcurrency: sketch.blurSettings && sketch.blurSettings.samplesPerFrame ? Math.max(Math.floor(16 / sketch.blurSettings.samplesPerFrame), 1) : 16
  }

  if (sketch.duration) settings.duration = sketch.duration
  if (sketch.totalFrames) settings.totalFrames = sketch.totalFrames
  if (sketch.time) settings.time = sketch.time
  if (sketch.endTime) settings.endTime = sketch.endTime

  return PELLICOLA(rerequire(`./sketches/${sketch.sketch}`), settings)
    .catch(console.error)
}

function showPrompt () {
  const sketches = rerequire('./definitions')

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'sketch',
        message: 'Which sketch do you want to render?',
        choices: Object.entries(sketches).map(([key, val]) => {
          return {
            name: `${key.length === 1 ? ' ' : ''}${key}. ${val.sketch} (${val.duration ? val.duration + 's' : val.totalFrames + ' frames'}${val.time ? `, start: ${val.time}s` : ''}${val.endTime ? `, end: ${val.endTime}s` : ''})${val.blurSettings ? '    + blur' : ''}`,
            value: key
          }
        }).concat([
          new inquirer.Separator(),
          { name: 'Reload options', value: 'reload' }
        ]),
        pageSize: 20
      }
    ])
    .then(({ sketch }) => {
      if (sketch !== 'reload') {
        return inquirer.prompt([{
          type: 'confirm',
          name: 'fullsize',
          message: 'Do you want to render at full size?',
          default: true
        }])
          .then(({ fullsize }) => runSketch(parseInt(sketch), { small: !fullsize }))
      }
      return ''
    })
    .then(outPath => { C.l(outPath, '') })
    .then(showPrompt)
}

showPrompt()
