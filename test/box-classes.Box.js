import test from 'ava'
import { Size, Box, Point } from '../lib/box-classes'

test('Box instances have numerical properties', t => {
  const testBox = new Box([-50, 700, 100, 200])
  t.is(testBox.x, -50)
  t.is(testBox.y, 700)
  t.is(testBox.width, 100)
  t.is(testBox.height, 200)
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

test('Box can get its Size for you', t => {
  const testBox = new Box([400, 700])
  const derivedSize = testBox.size()
  t.true(derivedSize instanceof Size)
  t.is(derivedSize.width, testBox.width)
  t.is(derivedSize.height, testBox.height)
})

test('Box can get its position as a Point for you', t => {
  const testBox = new Box([400, 700])
  const derivedPosition = testBox.position()
  t.true(derivedPosition instanceof Point)
  t.is(derivedPosition.x, testBox.x)
  t.is(derivedPosition.y, testBox.y)
})

test('Box can be rounded to containing box on integer grid', t => {
  t.deepEqual(new Box([20, 30, 40, 50]).round(), new Box([20, 30, 40, 50]))
  t.deepEqual(new Box([2.5, 4.5]).round(), new Box([3, 5]))
  t.deepEqual(new Box([0.25, 0.15, 2.5, 4.5]).round(), new Box([3, 5]))
  t.deepEqual(new Box([0.75, 0.65, 2.5, 4.5]).round(), new Box([4, 6]))
})

test('Box can be rounded mutably or immutably', t => {
  const testBox = new Box([2.5, 4.5])
  const roundedBox = testBox.rounded()
  t.deepEqual(roundedBox, new Box([3, 5]))
  t.deepEqual(testBox, new Box([2.5, 4.5]))
})

test('Box can be translated', t => {
  t.deepEqual(new Box([50, 50]).translate([0, 0]), new Box([50, 50]))
  t.deepEqual(new Box([50, 50]).translate([10, 10]), new Box([10, 10, 50, 50]))
  t.deepEqual(new Box([50, 50]).translate([-50, 0]), new Box([-50, 0, 50, 50]))
  t.deepEqual(new Box([50, 50]).translate([0, -10]), new Box([0, -10, 50, 50]))
})

test('Box can be translated mutably or immutably', t => {
  const testBox = new Box([10, 5])
  t.is(testBox.translate([5, 5]), testBox)
  t.not(testBox.translated([-5, 10]), testBox)
})

test('Box can be cropped', t => {
  t.deepEqual(new Box([100, 200]).crop([100, 200]), new Box([100, 200]))
  t.deepEqual(new Box([200, 200]).crop([100, 200]), new Box([50, 0, 100, 200]))
  t.deepEqual(new Box([200, 200]).crop([200, 100]), new Box([0, 50, 200, 100]))
  t.deepEqual(new Box([400, 200]).crop([100, 100]), new Box([100, 0, 200, 200]))
  t.deepEqual(new Box([400, 200]).crop([800, 200]), new Box([0, 50, 400, 100]))
})

test('Box can be cropped mutably or immutably', t => {
  const testBox = new Box([10, 5])
  t.is(testBox.crop([5, 5]), testBox)
  t.not(testBox.cropped([20, 20]), testBox)
})

test('Box can be zoomed', t => {
  t.deepEqual(new Box([400, 200]).zoom(2), new Box([100, 50, 200, 100]))
  t.deepEqual(new Box([400, 200]).zoom(0.5), new Box([-200, -100, 800, 400]))
  t.deepEqual(new Box([100, 50, 400, 200]).zoom(2), new Box([200, 100, 200, 100]))
})

test('Box can be zoomed mutably or immutably', t => {
  const testBox = new Box([-5, 16, 237, 92])
  t.is(testBox.zoom(0.2), testBox)
  t.not(testBox.zoomed(3), testBox)
})

/* ================================================================= /*

  I N H E R I T E D   M E T H O D S

/* ================================================================= */

test('Box can tell you its area', t => {
  const testBox = new Box([20, 3])
  const area = testBox.area()
  t.is(typeof area, 'number')
  t.is(area, 60)
})

test('Box can tell you its aspect ratio', t => {
  t.is(new Box([100, 200]).aspectRatio(), 0.5)
})

test('Box can be scaled', t => {
  const testBox = new Box([-20, 20, 10, 5])
  t.deepEqual([...testBox.scale(2)], [-20, 20, 20, 10])
  t.deepEqual([...testBox.scaled(0.5)], [-20, 20, 10, 5])
})

test('Box can be fit to another size', t => {
  t.deepEqual(
    new Box([19, 27, 50, 50]).fit([100, 100]),
    new Box([19, 27, 50, 50])
  )
  t.deepEqual(
    new Box([19, 27, 50, 200]).fit([100, 100]),
    new Box([19, 27, 25, 100])
  )
  t.deepEqual(
    new Box([19, 27, 200, 50]).fit([100, 100]),
    new Box([19, 27, 100, 25])
  )
  t.deepEqual(
    new Box([19, 27, 400, 200]).fit([100, 100]),
    new Box([19, 27, 100, 50])
  )
})

test('Box can be truncated to match an aspect ratio', t => {
  t.deepEqual(
    new Box([50, 50, 200, 100]).truncate(2),
    new Box([50, 50, 200, 100])
  )
  t.deepEqual(
    new Box([50, 50, 100, 100]).truncate(2),
    new Box([50, 50, 100, 50])
  )
  t.deepEqual(
    new Box([50, 50, 300, 100]).truncate(2),
    new Box([50, 50, 200, 100])
  )
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

test('Box can be cloned', t => {
  const testBox = new Box([30, 30, 200, 150])
  const clone = testBox.clone()
  t.not(testBox, clone)
  t.deepEqual(testBox, clone)
})

test('Box can be converted back to an array', t => {
  const boxArray = [-10, 20, 100, 120]
  const testBox = new Box(boxArray)
  t.deepEqual(testBox.toArray(), boxArray)
})

test('Box is iterable', t => {
  const testArray = [20, -10, 300, 670]
  t.deepEqual([...new Box(testArray)], testArray)
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

test('Box can be constructed from only width and height', t => {
  const testBox = new Box([20, 10])
  t.is(testBox.x, 0)
  t.is(testBox.y, 0)
  t.is(testBox.width, 20)
  t.is(testBox.height, 10)
})

test('Box can be instantiated from a 2-member array', t => {
  const testArr = [50, 60]
  t.deepEqual([...new Box(testArr)], [0, 0, ...testArr])
})

test('Box can be instantiated from a 4-member array', t => {
  const testArr = [-10, -15, 50, 60]
  t.deepEqual([...new Box(testArr)], testArr)
})

test('Box can be instantiated from another Box instance', t => {
  const testArr = [-10, -15, 50, 60]
  const testBox = new Box(testArr)
  t.deepEqual([...new Box(testBox)], testArr)
})

test('Box can be instantiated from a Size instance', t => {
  const testArr = [50, 60]
  const testSize = new Size(testArr)
  t.deepEqual([...new Box(testSize)], [0, 0, ...testArr])
})

test('Box can be instantiated without arguments', t => {
  t.notThrows(() => new Box())
})

test('Box throws if not passed an array, Box, or Size', t => {
  t.throws(() => new Box('square'))
  t.throws(() => new Box({ circle: 'O' }))
  t.throws(() => new Box(new Point()))
})

test('Box throws if passed array is wrong size', t => {
  t.throws(() => new Box([]))
  t.throws(() => new Box([1, 2, 3]))
  t.throws(() => new Box([1, 2, 3, 4, 5, 6]))
})
