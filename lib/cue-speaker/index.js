const VLDT = require('@delucis/aproba')
const PATH = require('path')
const MKDIR = require('make-dir')
const GG = require('gauge')
const SAY = require('../say')

const cues = [
  ['Welcome, the piece is about to start. Good luck!', { path: '00-00' }],

  ['Section 1 starts in [[rate 90]] 3, 2, 1, start', { path: '01-00' }],
  ['First section: cover mouthpiece and play low register, granulated sound', { path: '01-fl' }],
  ['First section: bow col legno tratto, damp with the left hand', { path: '01-va' }],
  ['First section: slow, low, sul tasto glissandi', { path: '01-vc' }],
  ['First section: sponge against poly styrene', { path: '01-ob' }],

  // soft entrance
  ['Continue, gradually adding whistle tones', { path: '02-fl' }],
  ['Slowly start to scrape the [[rate 85]] brush [[rate 130]] on the gong', { path: '02-vn' }],

  // hard cut
  ['Prepare sponge and poly styrene', { path: '03-C-ob-1' }],
  ['Play in [[rate 90]] 3, 2, 1, play', { path: '03-C-ob-2' }],
  ['Prepare to rustle leaves', { path: '03-C-vn-1' }],
  ['Rustle in [[rate 90]] 3, 2, 1, rustle', { path: '03-C-vn-2' }],

  // hard cut
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '04-ob-1' }],
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '04-vn-1' }],
  ['Take vyah-lin', { path: '04-vn-2', rate: 100 }],
  ['Prepare to play high A', { path: '04-kb-1' }],
  ['Play in [[rate 90]] 3, 2, 1, play', { path: '04-kb-2' }],
  ['Take oboe and play a high A once or twice', { path: '04-ob-2' }],

  // soft entrance
  ['Gradually introduce harmonics starting on [[rate 90]] A', { path: '05-vn-va-vc' }],

  // soft entrance
  ['Join the strings with high notes', { path: '06-fl' }],
  ['Release the A', { path: '06-kb-1' }],
  ['Turn on one of the E Bose', { path: '06-kb-2' }],
  ['Turn on the other E Bow', { path: '06-kb-3' }],
  ['Carefully take the corrugated conduit and tilt it', { path: '06-ob' }],
  ['Gradually play less and less and then put down the violin', { path: '06-vn' }],

  // hard cut
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '07-fl-va-vc' }],
  ['Prepare to [[rate 70]] boe [[rate 120]] the [[rate 160]] poly styrene', { path: '07-vn-1' }],
  ['Bow the poly styrene in [[rate 90]] 3, 2, 1, bow', { path: '07-vn-2' }],

  // hard cut
  ['Prepare to damp zither', { path: '08-kb-1' }],
  ['Damp zither in [[rate 90]] 3, 2, 1, damp', { path: '08-kb-2' }],
  ['Gently remove E Bose', { path: '08-kb-3' }],
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '08-vn' }],
  ['Carefully put down corrugated conduit in 6, 5, 4, [[rate 90]] 3, 2, 1, down', { path: '08-ob' }],
  ['Prepare for slow, low, glissandi', { path: '08-vc-1' }],
  ['Play in [[rate 90]] 3, 2, 1, play', { path: '08-vc-2' }],

  // hard cut
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '09-vc' }],
  ['Prepare sponge and poly styrene', { path: '09-ob-1' }],
  ['Play in [[rate 90]] 3, 2, 1, play', { path: '09-ob-2' }],

  // hard cut
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '10-ob' }],
  ['Prepare to play, long, soft, boed, tones', { path: '10-vn-va-vc-1' }],
  ['Starting from nothing, play in [[rate 90]] 3, 2, 1, play', { path: '10-vn-va-vc-2' }],

  // 11 - soft entrance
  ['Take oboe', { path: '11-A-ob-1' }],
  ['Play long notes in your highest register, micro tones are welcome', { path: '11-A-ob-2' }],
  ['Take yaw instrument', { path: '11-A-fl' }],
  ['[[rate 90]] Decor ate [[rate 110]] others with soft pulsation', { path: '11-B-fl' }],

  // 12 - soft entrance
  ['Finish your note or phrase and then stop playing', { path: '12-ob' }],
  ['Continue decorating, but do it less and less frequently', { path: '12-fl' }],
  ['Add slow, low register movement, always playing at least one note', { path: '12-kb' }],
  ['Continue, gradually aligning changes of note to the pulsation', { path: '12-vn-va-vc' }],

  // 13 - soft entrance
  ['Finish your current decoration then stop playing', { path: '13-fl' }],
  ['Gradually harden your sound and narrow your range', { path: '13-vn-va-vc' }],
  ['Continue, thickening the texture to a slowly shifting chord', { path: '13-kb' }],
  ['Fade out', { path: '13-vn-2' }],

  // 14 - soft entrance
  ['Settle onto a low F sharp, then gradually soften your sound', { path: '14-va' }],
  ['Settle onto a mid-range G, then gradually soften your sound', { path: '14-vc' }],
  ['Settle onto a G major seven and hold it', { path: '14-kb' }],
  ['Prepare to rustle leaves', { path: '14-ob-1' }],
  ['Gently rustle leaves', { path: '14-ob-2' }],
  ['Prepare to use the metal brush', { path: '14-vn-1' }],
  ['Gently brush the poly styrene', { path: '14-vn-2' }],

  // 15 - hard cut
  ['Release chord', { path: '15-kb' }],
  ['Get quieter and slowly glissando upwards', { path: '15-va' }],
  ['Get quieter and slowly glissando downwards', { path: '15-vc' }],

  // 16 - soft entrance
  ['Try to repeat the sentences that follow', { path: '16-fl-kb' }],
  ['While continuing yaw current sounds, try also to repeat the sentences that follow', { path: '16-va-vc-ob-vn' }],

  // 17 - hard cut
  ['Cut to silence in [[rate 90]] 3, 2, 1, cut', { path: '17-all' }]
]

async function saveCues (cues) {
  VLDT('A', arguments)
  const gauge = new GG()
  gauge.done = 0
  gauge.update = (increment = true) => {
    if (increment) gauge.done++
    gauge.show(`Generating spoken cues ${gauge.done}/${cues.length}`, gauge.done / cues.length)
    gauge.pulse()
  }
  gauge.update(false)
  await Promise.all(cues.map(async ([s, { path, rate, voice } = {}]) => {
    path = PATH.join(__dirname, '../../build/cue-speaker', `${path}.aiff`)
    rate = rate || 120
    await MKDIR(PATH.dirname(path))
    await SAY(s, { path, rate, voice })
    gauge.update()
  }))
  gauge.hide()
}

saveCues(cues)
