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
