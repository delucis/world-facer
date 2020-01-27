const PATH = require('path')
const FS = require('fs').promises
const VLDT = require('@delucis/aproba')
const ESCAPE = require('any-shell-escape')
const QX = require('@perl/qx')

async function say (
  s,
  { pad = 0, path, head, rate, voice, compressed = false } = {}
) {
  VLDT('S|SO', arguments)
  const needsSoX = pad || head
  const ext = PATH.extname(path)
  if (needsSoX) {
    if (!path) throw new TypeError('path option is undefined')
    path = path.replace(ext, '.caf')
  }

  const opts = []
  if (path) opts.push('-o', path)
  if (rate) opts.push('-r', rate)
  if (voice) opts.push('-v', voice)
  if (needsSoX) {
    opts.push('--file-format=caff --data-format=aac')
  } else if (compressed) {
    opts.push('--file-format=mp4f --data-format=aac')
  }
  opts.push(s)

  await QX`say ${ESCAPE(opts)}`

  if (needsSoX) {
    const newPath = path.replace('.caf', '.mp3')
    if (typeof pad !== 'number') pad = 0
    let soxOpts = [path, head ? '-p' : newPath, 'pad', pad]
    if (head) { // concatenate “head” file with padded say output
      const subCommand = `|sox ${ESCAPE(soxOpts)}`
      soxOpts = [head, subCommand, newPath]
    }
    await QX`sox ${ESCAPE(soxOpts)}`
    await FS.unlink(path)
    return newPath
  }

  return path
}
module.exports = say
