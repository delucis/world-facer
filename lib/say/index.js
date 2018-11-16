const VLDT = require('@delucis/aproba')
const QX = require('@perl/qx')

async function say (s, { path, rate, voice } = {}) {
  VLDT('S|SO', arguments)
  let opts = ''
  if (path) opts += `-o ${path} `
  if (rate) opts += `-r ${rate} `
  if (voice) opts += `-v ${voice}`
  await QX`say ${opts}"${s}"`
}
module.exports = say
