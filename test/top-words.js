import test from 'ava'
import topWords from '../lib/top-words'

test('Identifies the most common word', t => {
  const s = 'A sentence with the word sentence repeated.'
  t.is(topWords(s)[0], 'sentence')
})

test('Funktioniert auch auf Deutsch', t => {
  const s = 'Satz für Satz wird der Dichter satt.'
  t.is(topWords(s, { lang: 'de' })[0], 'satz')
})

test('Ignores imaginary or unknown languages', t => {
  const s = 'A sentence with the word sentence repeated.'
  t.is(topWords(s, { lang: 'toffee' })[0], 'sentence')
})

test('Ignores punctuation', t => {
  const s = 'A sentence with repeated words excludes punctuation, lumping together words followed or preceded by punctuation when they are repeated. This is what it means to be repeated: “repeated” words can be simply repeated, reiterated or emphasised.'
  t.is(topWords(s)[0], 'repeated')
})

test('Lets you specify the number of results', t => {
  const s = 'Some long sentence with plenty of words in to analyse and only extract the top three words from even though there are more than three words.'
  t.is(topWords(s, { n: 3 }).length, 3)
})

test('Can’t return more words than are input', t => {
  t.is(topWords('Short sentence', { n: 5 }).length, 2)
})
