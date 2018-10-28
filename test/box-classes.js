import test from 'ava'
import { Size, Box } from '../lib/box-classes'

test('Size instances have numerical width and height', t => {
  const testSize = new Size([100, 200])
  t.is(testSize.width, 100)
  t.is(testSize.height, 200)
})

test('Size can get a Box its size', t => {
  const testSize = new Size([100, 200])
  const derivedBox = testSize.box()
  t.true(derivedBox instanceof Box)
  t.is(derivedBox.width, testSize.width)
  t.is(derivedBox.height, testSize.height)
})

test('Size can tell you its area', t => {
  const testSize = new Size([10, 5])
  const area = testSize.area()
  t.is(typeof area, 'number')
  t.is(area, 50)
})

test('Size can be converted back to an array', t => {
  const sizeArray = [100, 120]
  const testSize = new Size(sizeArray)
  t.deepEqual(testSize.toArray(), sizeArray)
})

test('Size throws if not passed an array', t => {
  t.throws(() => new Size('small'))
})

test('Size throws if members of passed array are not numbers', t => {
  t.throws(() => new Size(['not', () => 'numbers']))
})

test('Size throws if passed array is wrong size', t => {
  t.throws(() => new Size([1]))
  t.throws(() => new Size([1, 2, 3]))
})

test('Box instances have numerical properties', t => {
  const testBox = new Box([-50, 700, 100, 200])
  t.is(testBox.x, -50)
  t.is(testBox.y, 700)
  t.is(testBox.width, 100)
  t.is(testBox.height, 200)
})

test('Box can be constructed from only width and height', t => {
  const testBox = new Box([20, 10])
  t.is(testBox.x, 0)
  t.is(testBox.y, 0)
  t.is(testBox.width, 20)
  t.is(testBox.height, 10)
})

test('Box can get its Size for you', t => {
  const testBox = new Box([400, 700])
  const derivedSize = testBox.size()
  t.true(derivedSize instanceof Size)
  t.is(derivedSize.width, testBox.width)
  t.is(derivedSize.height, testBox.height)
})

test('Box can tell you its area', t => {
  const testBox = new Box([20, 3])
  const area = testBox.area()
  t.is(typeof area, 'number')
  t.is(area, 60)
})

test('Box can be converted back to an array', t => {
  const boxArray = [-10, 20, 100, 120]
  const testBox = new Box(boxArray)
  t.deepEqual(testBox.toArray(), boxArray)
})

test('Box throws if not passed an array', t => {
  t.throws(() => new Box('square'))
})

test('Box throws if passed array is wrong size', t => {
  t.throws(() => new Box([]))
  t.throws(() => new Box([1, 2, 3]))
  t.throws(() => new Box([1, 2, 3, 4, 5, 6]))
})
