const VLDT = require('@delucis/aproba')
const ESCAPE = require('any-shell-escape')
const QX = require('@perl/qx')

async function say (s, { path, rate, voice } = {}) {
  VLDT('S|SO', arguments)
  let opts = []
  if (path) opts.push('-o', path)
  if (rate) opts.push('-r', rate)
  if (voice) opts.push('-v', voice)
  opts.push(s)
  await QX`say ${ESCAPE(opts)}`
}
module.exports = say
