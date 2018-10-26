import test from 'ava'
import { crop, fit } from '../lib/canvas-utils'

test('crop: returns input if they match aspect ratio', t => {
  t.deepEqual(crop([200, 100], 2), [200, 100])
})

test('crop: scales height if aspect less than desired', t => {
  t.deepEqual(crop([100, 100], 2), [100, 50])
})

test('crop: scales width if aspect greater than desired', t => {
  t.deepEqual(crop([300, 100], 2), [200, 100])
})

test('fit: returns input if input fits', t => {
  t.deepEqual(fit([50, 50], [100, 100]), [50, 50])
})

test('fit: scales down if height doesn’t fit', t => {
  t.deepEqual(fit([50, 200], [100, 100]), [25, 100])
})

test('fit: scales down if width doesn’t fit', t => {
  t.deepEqual(fit([200, 50], [100, 100]), [100, 25])
})

test('fit: scales down if width and height don’t fit', t => {
  t.deepEqual(fit([400, 200], [100, 100]), [100, 50])
})
