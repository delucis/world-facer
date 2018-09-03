import ava from 'ava'
import ninos from 'ninos'
import c from '../lib/console'

const test = ninos(ava)

test('Exports an object', t => {
  t.is(typeof c, 'object')
})

test('Makes a string bold', t => {
  t.is(c.b('Hi'), '\u001b[1mHi\u001b[22m')
})

test('Makes a string blue', t => {
  t.is(c.blue('Hi'), '\u001b[34mHi\u001b[39m')
})

test('Makes a string red', t => {
  t.is(c.red('Hi'), '\u001b[31mHi\u001b[39m')
})

test('Makes a string yellow', t => {
  t.is(c.yellow('Hi'), '\u001b[33mHi\u001b[39m')
})

test('Makes a string white', t => {
  t.is(c.white('Hi'), '\u001b[37mHi\u001b[39m')
})

test('Can log to the console', t => {
  console.log = t.context.stub()
  c.log('Test logger', 55, true, ['some', 'array', 'text'], { object: 'also' })
  t.is(console.log.calls.length, 1)
  t.is(console.log.calls[0].arguments[1], '\n      55')
})

test('Can log with indentation to the console', t => {
  console.log = t.context.stub()
  c.l('Test logger')
  t.is(console.log.calls.length, 1)
  t.is(console.log.calls[0].arguments[0], '      Test logger')
})

test('Can warn to the console', t => {
  console.warn = t.context.stub()
  c.warn('Test warner', Infinity, null, ['yikes', 77, 'watch', 'out'], { 'certain-case': true })
  t.is(console.warn.calls.length, 1)
  t.is(console.warn.calls[0].arguments[1], '\n      Infinity')
})

test('Can warn with indentation to the console', t => {
  console.warn = t.context.stub()
  c.w('Test warner')
  t.is(console.warn.calls.length, 1)
  t.is(console.warn.calls[0].arguments[0], '      Test warner')
})

test('Can error to the console', t => {
  console.error = t.context.stub()
  c.err('Test errorer', -45, false, ['different', 'array', 'words'], { object: 27 })
  t.is(console.error.calls.length, 1)
  t.is(console.error.calls[0].arguments[1], '\n      -45')
})

test('Can error with indentation to the console', t => {
  console.error = t.context.stub()
  c.e('Test errorer')
  t.is(console.error.calls.length, 1)
  t.is(console.error.calls[0].arguments[0], '      Test errorer')
})
