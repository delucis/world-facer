const PATH = require('path')
const MKDIR = require('make-dir')
const FORMAT = require('date-fns/format')
const RANDOM = require('canvas-sketch-util/random')
const { lerp: LERP } = require('canvas-sketch-util/math')
const EASE = require('eases/quad-in')
const PROFANITIES = new Set(require('profanities'))
const PW = require('../paper-words')
const SAY = require('../say')
const NLP = require('../nlp')

const introFile = './intro.caf'
const introDuration = 4 // the intro file is 4 seconds long
const speakingStartTime = 8.25 * 60 // 495s or 08:15

function getPadTime (head) {
  return speakingStartTime - (head ? introDuration : 0)
}

async function makeNews ({ pad = false, head = false }) {
  const maxSentencesPerVoice = 9
  const maxSentenceLength = 16
  const sentences = RANDOM.shuffle(
    (await PW.data()).map(({ text }) => RANDOM.pick(
      // split article into sentences
      NLP.sentences(text || '')
        // discard start and end of article
        .slice(6, -6)
        // shorten long sentences
        .map(sentence => {
          const words = sentence.split(/\s+/)
          if (words.length < maxSentenceLength) return sentence
          const startExcess = Math.floor((words.length - maxSentenceLength) / 2)
          return words
            .slice(startExcess, startExcess + maxSentenceLength)
            .join(' ')
        })
        // exclude short sentences or sentences containing blocked words
        .filter(sentence => {
          if (!(sentence.split(/\s+/).length > 5)) return false
          let isClean = true
          for (let word = 0; word < sentence.length; word++) {
            if (PROFANITIES.has(sentence[word])) {
              isClean = false
              break
            }
          }
          return isClean
        })
    )) // pick random sentence
  ) // shuffle sentence (bookmark) order
  const sentencesPerVoice = Math.min(
    maxSentencesPerVoice, Math.floor(sentences.length)
  )
  let voiceString = ''
  for (let sentence = 0; sentence < sentencesPerVoice; sentence++) {
    const progress = EASE(sentence / (sentencesPerVoice - 1))
    const slncMin = LERP(8000, 100, progress)
    const rateCenter = LERP(115, 135, progress)
    const slnc = RANDOM.rangeFloor(slncMin, slncMin * 2)
    const rate = RANDOM.rangeFloor(rateCenter - 5, rateCenter + 5)
    voiceString += ` [[slnc ${slnc}]] `
    voiceString += ` [[rate ${rate}]] `
    voiceString += sentences[sentencesPerVoice + sentence]
  }
  const filename = `${FORMAT(new Date(), 'yyyyMMdd-HHmmss.SSS')}-${Math.round(Math.random() * 9999)}.mp4`
  const path = PATH.join(__dirname, '../../build/news-maker', filename)
  await MKDIR(PATH.dirname(path))
  const resolvedPath = await SAY(
    voiceString,
    {
      path,
      voice: 'Fiona',
      compressed: true,
      pad: pad ? getPadTime(head) : 0,
      head: head ? PATH.join(__dirname, introFile) : false
    }
  )
  return PATH.join(PATH.basename(PATH.dirname(resolvedPath)), PATH.basename(resolvedPath))
}

module.exports = makeNews
