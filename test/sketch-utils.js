import test from 'ava'
import { rangesIncludeValue, lerpBreakpoints, stepBreakpoints } from '../lib/sketch-utils'

test('rangesIncludeValue > is true for a number in ranges', t => {
  t.is(rangesIncludeValue([[3, 6], [2, 2.2]], 5), true)
})

test('rangesIncludeValue > is false for a number in none of the ranges', t => {
  t.is(rangesIncludeValue([[-20, -15], [100, 112]], 5), false)
})

test('rangesIncludeValue > is true for a number in multiple ranges', t => {
  t.is(rangesIncludeValue([[0, 10], [2, 4]], 3), true)
})

test('rangesIncludeValue > throws if passed bad arguments', t => {
  t.throws(() => rangesIncludeValue('string', 5))
  t.throws(() => rangesIncludeValue([[1, 2]], 'string'))
})

test('rangesIncludeValue > throws if ranges aren’t arrays', t => {
  t.throws(() => rangesIncludeValue([12, 10], 5))
})

test('lerpBreakpoints > can interpolate between breakpoints', t => {
  t.is(lerpBreakpoints([0, 1], 0.5), 0.5)
})

test('stepBreakpoints > can step through breakpoints', t => {
  t.is(stepBreakpoints([0, 1], 0.5), 0)
})

test('stepBreakpoints > will clamp to lowest breakpoint', t => {
  t.is(stepBreakpoints(['yes', 'no'], -1), 'yes')
})

test('stepBreakpoints > will clamp to highest breakpoint', t => {
  t.is(stepBreakpoints([0.2, 0.5], 2), 0.5)
})
