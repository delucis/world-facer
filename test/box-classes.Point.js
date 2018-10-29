import test from 'ava'
import { Point } from '../lib/box-classes'

test('Point instances have numerical x and y components', t => {
  const testPoint = new Point([100, 200])
  t.is(testPoint.x, 100)
  t.is(testPoint.y, 200)
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

test('Point can be translated', t => {
  t.deepEqual(new Point([23, 47]).translate([0, 0]), new Point([23, 47]))
  t.deepEqual(new Point([0, 0]).translate([10, 10]), new Point([10, 10]))
  t.deepEqual(new Point([0, 0]).translate([-15, 30]), new Point([-15, 30]))
  t.deepEqual(new Point([99, 22]).translate([0, 5]), new Point([99, 27]))
})

test('Point can be translated mutably or immutably', t => {
  const testPoint = new Point([10, 5])
  t.is(testPoint.translate([2, 5]), testPoint)
  t.not(testPoint.translated([8, 10]), testPoint)
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

test('Point can be cloned', t => {
  const testPoint = new Point([20, 30])
  const clone = testPoint.clone()
  t.not(clone, testPoint)
  t.deepEqual(clone, testPoint)
})

test('Point can be converted back to an array', t => {
  const pointArray = [100, 120]
  const testPoint = new Point(pointArray)
  t.deepEqual(testPoint.toArray(), pointArray)
})

test('Point is iterable', t => {
  const testArray = [340, 290]
  t.deepEqual([...new Point(testArray)], testArray)
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

test('Point can be instantiated from an array', t => {
  const testArr = [320, 240]
  t.deepEqual([...new Point(testArr)], testArr)
})

test('Point can be instantiated from another Point instance', t => {
  const testArr = [320, 240]
  const testPoint = new Point(testArr)
  t.deepEqual([...new Point(testPoint)], testArr)
})

test('Point can be instantiated without arguments', t => {
  t.notThrows(() => new Point())
})

test('Point throws if not passed an array', t => {
  t.throws(() => new Point('small'))
  t.throws(() => new Point({ x: 5 }))
})

test('Point throws if members of passed array are not numbers', t => {
  t.throws(() => new Point(['not', () => 'numbers']))
})

test('Point throws if passed array is wrong size', t => {
  t.throws(() => new Point([1]))
  t.throws(() => new Point([1, 2, 3]))
})
