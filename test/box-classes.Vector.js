import test from 'ava'
import { Vector } from '../lib/box-classes'

test('Vector instances have numerical x and y components', t => {
  const testVector = new Vector([100, 200])
  t.is(testVector.x, 100)
  t.is(testVector.y, 200)
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

test('Vector can be translated', t => {
  t.deepEqual(new Vector([23, 47]).translate([0, 0]), new Vector([23, 47]))
  t.deepEqual(new Vector([0, 0]).translate([10, 10]), new Vector([10, 10]))
  t.deepEqual(new Vector([0, 0]).translate([-15, 30]), new Vector([-15, 30]))
  t.deepEqual(new Vector([99, 22]).translate([0, 5]), new Vector([99, 27]))
})

test('Vector can be translated mutably or immutably', t => {
  const testVector = new Vector([10, 5])
  t.is(testVector.translate([2, 5]), testVector)
  t.not(testVector.translated([8, 10]), testVector)
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

test('Vector can be cloned', t => {
  const testVector = new Vector([20, 30])
  const clone = testVector.clone()
  t.not(clone, testVector)
  t.deepEqual(clone, testVector)
})

test('Vector can be converted back to an array', t => {
  const vectorArray = [100, 120]
  const testVector = new Vector(vectorArray)
  t.deepEqual(testVector.toArray(), vectorArray)
})

test('Vector is iterable', t => {
  const testArray = [340, 290]
  t.deepEqual([...new Vector(testArray)], testArray)
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

test('Vector can be instantiated from an array', t => {
  const testArr = [320, 240]
  t.deepEqual([...new Vector(testArr)], testArr)
})

test('Vector can be instantiated from another Vector instance', t => {
  const testArr = [320, 240]
  const testVector = new Vector(testArr)
  t.deepEqual([...new Vector(testVector)], testArr)
})

test('Vector can be instantiated without arguments', t => {
  t.notThrows(() => new Vector())
})

test('Vector throws if not passed an array', t => {
  t.throws(() => new Vector('small'))
  t.throws(() => new Vector({ x: 5 }))
})

test('Vector throws if members of passed array are not numbers', t => {
  t.throws(() => new Vector(['not', () => 'numbers']))
})

test('Vector throws if passed array is wrong size', t => {
  t.throws(() => new Vector([1]))
  t.throws(() => new Vector([1, 2, 3]))
})
