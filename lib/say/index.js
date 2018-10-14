const QX = require('@perl/qx')
const PW = require('../paper-words')

const say = async s => {
  await QX`say "${s}"`
}

const wait = (d = 1000) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, d)
  })
}

async function sayTitle () {
  const data = await PW.data()
  const title = data[Math.floor(Math.random() * (data.length - 1))].title
  return say(title)
}
module.exports = sayTitle

async function keepSaying () {
  await sayTitle()
  await wait()
  await keepSaying()
}
module.exports.keepSaying = keepSaying
