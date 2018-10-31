import test from 'ava'
import fs from 'fs'
import SimilarityMatrix from '../lib/similarity-matrix'
import scrape from '../lib/paper-scraper'
import pps from '../lib/paper-picture-scraper'
import pp from '../lib/paper-pictures'

test.before('download some data', async t => {
  t.context.spy(console, 'log', () => {})
  t.context.spy(console, 'error', () => {})
  await scrape({ n: 5, recurse: true, maxRecurse: 1 })
  await pps({ batchSize: 50 })
})

test('it constructs a new SimilarityMatrix class', t => {
  t.true(new SimilarityMatrix() instanceof SimilarityMatrix)
  t.true(Array.isArray(new SimilarityMatrix().keys))
  t.true(Array.isArray(new SimilarityMatrix().matrix))
  t.is(typeof new SimilarityMatrix().cache, 'object')
  t.is(new SimilarityMatrix().hasBuilt, false)
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

test.cb('it can build a matrix and write it to disk', async t => {
  const matrix = new SimilarityMatrix()
  await matrix.build()
  await matrix.write()
  fs.stat('similarity-matrix.json', t.end)
})

test('it can load a matrix from disk', async t => {
  const matrix = new SimilarityMatrix()
  await matrix.load()
  t.true(matrix.matrix.length > 0)
})
