const VLDT = require('@delucis/aproba')
const ESCAPE = require('any-shell-escape')
const QX = require('@perl/qx')

async function say (s, { path, rate, voice, compressed = false } = {}) {
  VLDT('S|SO', arguments)
  let opts = []
  if (path) opts.push('-o', path)
  if (rate) opts.push('-r', rate)
  if (voice) opts.push('-v', voice)
  if (compressed) opts.push('--file-format=mp4f --data-format=aac')
  opts.push(s)
  await QX`say ${ESCAPE(opts)}`
}
module.exports = say
