import test from 'ava'
import { Box, Point, Line } from '../lib/box-classes'

test('Line instances have arrays of points', t => {
  const testLine = new Line([[5, 10], [2, 20]])
  t.true(Array.isArray(testLine.points))
  t.true(testLine.points[0] instanceof Point)
})

test('Line instances can be empty', t => {
  t.deepEqual([...new Line()], [])
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

test('Line can be joined to another Line', t => {
  const points1 = [[0, 10], [-5, 5]]
  const points2 = [[90, 100], [40, 0]]
  t.deepEqual([...new Line(points1).join(points2)], points1.concat(points2))
})

test('Line can be translated', t => {
  t.deepEqual(
    new Line([[0, 0], [20, 30]]).translate([10, 15]),
    new Line([[10, 15], [30, 45]])
  )
  t.deepEqual(
    new Line([[0, 0], [-10, 50], [0, 0]]).translate([10, -15]),
    new Line([[10, -15], [0, 35], [10, -15]])
  )
})

test('Line can be translated mutably or immutably', t => {
  const testLine = new Line([[-2, 1], [3, 4]])
  t.is(testLine.translate([5, 10]), testLine)
  t.not(testLine.translated([5, 10]), testLine)
})

test('Line can return its bounding box', t => {
  t.deepEqual(...new Line([[0, 0], [10, 20]]).box(), ...new Box([10, 20]))
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

test('Line can be cloned', t => {
  const testLine = new Line([[8, 13], [21, 34]])
  const clone = testLine.clone()
  t.not(clone, testLine)
  t.deepEqual(clone, testLine)
})

test('Line can be converted back to an array', t => {
  const lineArr = [[100, 120], [1200, 1000]]
  const testLine = new Line(lineArr)
  t.deepEqual(testLine.toArray(), lineArr)
})

test('Line is iterable', t => {
  const testArr = [[340, 290], [-20, 2000]]
  t.deepEqual([...new Line(testArr)], testArr)
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

test('Line can be instantiated from an array of arrays', t => {
  const testArr = [[1, 2], [3, 4]]
  t.deepEqual([...new Line(testArr)], testArr)
})

test('Line can be instantiated from an array of Point instances', t => {
  const testArr = [[1, 2], [3, 4]]
  const pointsArr = testArr.map(p => new Point(p))
  t.deepEqual([...new Line(pointsArr)], testArr)
})

test('Line can be instantiated from a mixed array', t => {
  const testArr = [[1, 2], new Point([3, 4])]
  t.deepEqual([...new Line(testArr)], testArr.map(p => [...p]))
})

test('Line can be instantiated from another Line instance', t => {
  const testArr = [[1, 2], [3, 4]]
  const testLine = new Line(testArr)
  t.deepEqual([...new Line(testLine)], testArr)
})

test('Line can be instantiated without arguments', t => {
  t.notThrows(() => new Line())
})

test('Line throws if not passed an array', t => {
  t.throws(() => new Line('small'))
  t.throws(() => new Line({ x: 5 }))
})

test('Line throws if members of passed array are not arrays', t => {
  t.throws(() => new Line(['not', () => 'numbers']))
})

test('Line throws if points in passed arrays are not numbers', t => {
  t.throws(() => new Line([['a', 'b'], [2, 3]]))
})

test('Line throws if points in passed arrays are wrong size', t => {
  t.throws(() => new Line([[1]]))
  t.throws(() => new Line([[1, 2], [3]]))
})
