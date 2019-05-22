const PATH = require('path')
const FS = require('fs').promises
const VLDT = require('@delucis/aproba')
const ESCAPE = require('any-shell-escape')
const QX = require('@perl/qx')

async function say (s, { pad = 0, path, rate, voice, compressed = false } = {}) {
  VLDT('S|SO', arguments)
  const ext = PATH.extname(path)
  if (pad) {
    path = path.replace(ext, '.caf')
  }

  const opts = []
  if (path) opts.push('-o', path)
  if (rate) opts.push('-r', rate)
  if (voice) opts.push('-v', voice)
  if (pad) opts.push('--file-format=caff --data-format=aac')
  if (!pad && compressed) opts.push('--file-format=mp4f --data-format=aac')
  opts.push(s)

  await QX`say ${ESCAPE(opts)}`

  if (pad) {
    const newPath = path.replace('.caf', '.mp3')
    const soxOpts = [path, newPath, 'pad', pad]
    await QX`sox ${ESCAPE(soxOpts)}`
    await FS.unlink(path)
    return newPath
  }

  return path
}
module.exports = say
