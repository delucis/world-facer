import test from 'ava'
import nlp from '../lib/nlp'

const testString = 'Terminology mining, term extraction, term recognition, or glossary extraction, is a subtask of information extraction. The goal of terminology extraction is to automatically extract relevant terms from a given corpus. In the semantic web era, a growing number of communities and networked enterprises started to access and interoperate through the internet. Modeling these communities and their information needs is important for several web applications, like topic-driven web crawlers, web services, recommender systems, etc. The development of terminology extraction is essential to the language industry.'

test('Returns the language of input text', t => {
  const s = 'Vanaf morgen in de bioscoop kunnen wij een heel spannende nieuwe film gaan kijken!'
  t.is(nlp.language(s), 'nld')
})

test('Collects key phrases from input text', async t => {
  let phrases = await nlp.keyphrases(testString)
  t.true(Array.isArray(phrases))
  phrases.forEach(phrase => t.is(typeof phrase, 'string'))
})

test('Collects key words from input text', async t => {
  let words = await nlp.keywords(testString)
  t.true(Array.isArray(words))
  words.forEach(phrase => t.is(typeof phrase, 'string'))
})

test('topwords > It throws if passed a non-string argument', t => {
  t.throws(() => { nlp.topwords(75) })
})

test('topwords > It throws if passed badly formed options', t => {
  t.throws(() => { nlp.topwords('string', { n: 'three', lang: 57 }) })
})

test('topwords > Identifies the most common word', t => {
  const s = 'A sentence with the word sentence repeated.'
  t.is(nlp.topwords(s)[0], 'sentence')
})

test('topwords > Funktioniert auch auf Deutsch', t => {
  const s = 'Satz für Satz wird der Dichter satt.'
  t.is(nlp.topwords(s, { lang: 'de' })[0], 'satz')
})

test('topwords > Ignores imaginary or unknown languages', t => {
  const s = 'A sentence with the word sentence repeated.'
  t.is(nlp.topwords(s, { lang: 'toffee' })[0], 'sentence')
})

test('topwords > Ignores punctuation', t => {
  const s = 'A sentence with repeated words excludes punctuation, lumping together words followed or preceded by punctuation when they are repeated. This is what it means to be repeated: “repeated” words can be simply repeated, reiterated or emphasised.'
  t.is(nlp.topwords(s)[0], 'repeated')
})

test('topwords > Lets you specify the number of results', t => {
  const s = 'Some long sentence with plenty of words in to analyse and only extract the top three words from even though there are more than three words.'
  t.is(nlp.topwords(s, { n: 3 }).length, 3)
})

test('topwords > Can’t return more words than are input', t => {
  t.is(nlp.topwords('Short sentence', { n: 5 }).length, 2)
})

test('topwords > Can return a 2-tuple of [word, count] if asked', t => {
  const s = 'A sentence with the word sentence repeated.'
  t.deepEqual(nlp.topwords(s, { includeCount: true })[0], ['sentence', 2])
})
