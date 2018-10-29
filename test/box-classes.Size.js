import test from 'ava'
import { Size, Box } from '../lib/box-classes'

test('Size instances have numerical width and height', t => {
  const testSize = new Size([100, 200])
  t.is(testSize.width, 100)
  t.is(testSize.height, 200)
})

/* ================================================================

##     ## ######## ######## ##     ##  #######  ########   ######
###   ### ##          ##    ##     ## ##     ## ##     ## ##    ##
#### #### ##          ##    ##     ## ##     ## ##     ## ##
## ### ## ######      ##    ######### ##     ## ##     ##  ######
##     ## ##          ##    ##     ## ##     ## ##     ##       ##
##     ## ##          ##    ##     ## ##     ## ##     ## ##    ##
##     ## ########    ##    ##     ##  #######  ########   ######

===================================================================  */

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

test('Size can tell you its aspect ratio', t => {
  t.is(new Size([100, 200]).aspectRatio(), 0.5)
})

test('Size can be scaled', t => {
  const testSize = new Size([10, 5])
  t.deepEqual([...testSize.scale(2)], [20, 10])
  t.deepEqual([...testSize.scaled(0.5)], [10, 5])
})

test('Size can be scaled mutably or immutably', t => {
  const testSize = new Size([10, 5])
  t.is(testSize.scale(2), testSize)
  t.not(testSize.scaled(0.5), testSize)
})

test('Size can be fit to another size', t => {
  t.deepEqual(new Size([50, 50]).fit([100, 100]), new Size([50, 50]))
  t.deepEqual(new Size([50, 200]).fit([100, 100]), new Size([25, 100]))
  t.deepEqual(new Size([200, 50]).fit([100, 100]), new Size([100, 25]))
  t.deepEqual(new Size([400, 200]).fit([100, 100]), new Size([100, 50]))
})

test('Size can be fit mutably or immutably', t => {
  const testSize = new Size([50, 50])
  t.is(testSize.fit([100, 100]), testSize)
  t.not(testSize.fitted([100, 100]), testSize)
})

test('Size can be truncated to match an aspect ratio', t => {
  t.deepEqual(new Size([200, 100]).truncate(2), new Size([200, 100]))
  t.deepEqual(new Size([100, 100]).truncate(2), new Size([100, 50]))
  t.deepEqual(new Size([300, 100]).truncate(2), new Size([200, 100]))
})

test('Size can be truncated mutably or immutably', t => {
  const testSize = new Size([50, 50])
  t.is(testSize.truncate(1), testSize)
  t.not(testSize.truncated(0.5), testSize)
})

/* ====================================================

########  ########         ##     ##  ######  ########
##     ## ##               ##     ## ##    ## ##
##     ## ##               ##     ## ##       ##
########  ######   ####### ##     ##  ######  ######
##   ##   ##               ##     ##       ## ##
##    ##  ##               ##     ## ##    ## ##
##     ## ########          #######   ######  ########

======================================================= */

test('Size can be cloned', t => {
  const testSize = new Size([20, 30])
  const clone = testSize.clone()
  t.not(clone, testSize)
  t.deepEqual(clone, testSize)
})

test('Size can be converted back to an array', t => {
  const sizeArray = [100, 120]
  const testSize = new Size(sizeArray)
  t.deepEqual(testSize.toArray(), sizeArray)
})

test('Size is iterable', t => {
  const testArray = [340, 290]
  t.deepEqual([...new Size(testArray)], testArray)
})

/* ====================================

   ###    ########   ######    ######
  ## ##   ##     ## ##    ##  ##    ##
 ##   ##  ##     ## ##        ##
##     ## ########  ##   ####  ######
######### ##   ##   ##    ##        ##
##     ## ##    ##  ##    ##  ##    ##
##     ## ##     ##  ######    ######

======================================= */

test('Size can be instantiated from an array', t => {
  const testArr = [320, 240]
  t.deepEqual([...new Size(testArr)], testArr)
})

test('Size can be instantiated from another Size instance', t => {
  const testArr = [320, 240]
  const testSize = new Size(testArr)
  t.deepEqual([...new Size(testSize)], testArr)
})

test('Size can be instantiated without arguments', t => {
  t.notThrows(() => new Size())
})

test('Size throws if not passed an array or Size', t => {
  t.throws(() => new Size('small'))
  t.throws(() => new Size({ big: Infinity }))
  t.throws(() => new Size(new Box()))
})

test('Size throws if members of passed array are not numbers', t => {
  t.throws(() => new Size(['not', () => 'numbers']))
})

test('Size throws if passed array is wrong size', t => {
  t.throws(() => new Size([1]))
  t.throws(() => new Size([1, 2, 3]))
})
