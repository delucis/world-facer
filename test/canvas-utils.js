import test from 'ava'
import { truncate, fit, cropBox } from '../lib/canvas-utils'

test('truncate: returns input if they match aspect ratio', t => {
  t.deepEqual(truncate([200, 100], 2), [200, 100])
})

test('truncate: scales height if aspect less than desired', t => {
  t.deepEqual(truncate([100, 100], 2), [100, 50])
})

test('truncate: scales width if aspect greater than desired', t => {
  t.deepEqual(truncate([300, 100], 2), [200, 100])
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

test('cropBox: returns input as array', t => {
	t.deepEqual(cropBox([100, 200], [100, 200]), [0, 0, 100, 200])
})

test('cropBox: scales & translates if width doesn’t fit', t => {
	t.deepEqual(cropBox([200, 200], [100, 200]), [50, 0, 100, 200])
})

test('cropBox: scales & translates if height doesn’t fit', t => {
	t.deepEqual(cropBox([200, 200], [200, 100]), [0, 50, 200, 100])
})

test('cropBox: scales & translates if width & height don’t fit', t => {
	t.deepEqual(cropBox([400, 200], [100, 100]), [100, 0, 200, 200])
})
