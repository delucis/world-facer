import ava from 'ava'
import ninos from 'ninos'
import fs from 'fs'
import SimilarityMatrix from '../lib/similarity-matrix'
import scrape from '../lib/paper-scraper'
import pps from '../lib/paper-picture-scraper'
import pp from '../lib/paper-pictures'
import pt from '../lib/paper-thumbs'

const test = ninos(ava)

test.beforeEach('suppress console logging', t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
})

test.before('download some data', async t => {
  await scrape({ n: 5, recurse: true, maxRecurse: 1 })
  await pps({ batchSize: 50 })
  await pt()
})

test('it constructs a new SimilarityMatrix class', t => {
  const sm = new SimilarityMatrix()
  t.true(sm instanceof SimilarityMatrix)
  t.true(Array.isArray(sm.keys))
  t.true(Array.isArray(sm.matrix))
  t.is(typeof sm.cache, 'object')
  t.is(sm.hasBuilt, false)
})

test('it can add some images to the matrix ', async t => {
  const pictures = await pp()
  const matrix = new SimilarityMatrix()
  const maxImages = Math.min(5, pictures.length)
  for (let i = 0; i < maxImages; i++) {
    await matrix.addImage(pictures[i])
  }
  t.is(matrix.matrix.length, maxImages)
  t.is(matrix.keys.length, maxImages)
})

test('it can build a matrix from paper-pictures', async t => {
  const pictures = await pp()
  const matrix = new SimilarityMatrix()
  await matrix.build()
  t.is(matrix.matrix.length, pictures.length)
})

test.cb('it can build a matrix and write it to disk', t => {
  const matrix = new SimilarityMatrix()
  matrix.build()
    .then(() => matrix.write())
    .then(() => fs.stat('similarity-matrix.json', t.end))
})

test('it can load a matrix from disk', async t => {
  const matrix = new SimilarityMatrix()
  await matrix.load()
  t.true(matrix.matrix.length > 0)
})

test('it can retrieve similar images', async t => {
  const matrix = new SimilarityMatrix()
  await matrix.load()
  const matches = matrix.getSimilar(0)
  t.true(Array.isArray(matches))
  t.false(matches.includes(0))
  t.true(matches.length > 0)
})
