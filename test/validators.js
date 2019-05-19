import test from 'ava'
import v from '../lib/validators'

const tests = {
  isNull: {
    shouldPass: [null],
    shouldFail: [false, true, '', undefined, 0, NaN, {}, []]
  },
  isNaN: {
    shouldPass: [NaN, 'foo' / Infinity],
    shouldFail: [0, '', Infinity, -Infinity, Math.PI, true, false, null]
  },
  isString: {
    shouldPass: ['', 'text', ``, `longer \n te\txt`],
    shouldFail: [0, NaN, true, false, null]
  },
  isNumber: {
    shouldPass: [-90, 200, Infinity, -Infinity, Math.PI],
    shouldFail: ['-90', '200', 'Infinity', NaN, true, false, null]
  },
  isPercentageString: {
    shouldPass: ['67%', '-50%', '0%', '0.5%', '-27.999%', '194637.23280%'],
    shouldFail: [89, '-50', '0.5', 'text', '', '%', NaN, true, false, null]
  },
  isInteger: {
    shouldPass: [1, -999, 0, 0.000, 250.0],
    shouldFail: [1.2, Math.PI, -99.9, 2.0000001]
  },
  isPositiveNumber: {
    shouldPass: [0, 1.5, 27.3, Infinity, Math.PI, 3000],
    shouldFail: [-0.5, -15, -Infinity, -9997, '99', NaN, true, false, null]
  },
  isNegativeNumber: {
    shouldPass: [-0.5, -15, -Infinity, -9997],
    shouldFail: [0, 1.5, 27.3, Infinity, Math.PI, 3000, '-99', NaN, true, false, null]
  },
  isNumberInRangeInclusive: {
    shouldPass: [0, 1, 0.5, 0.2, 0.9],
    shouldFail: [-0.001, 1.001, NaN, true, false, null]
  },
  isNumberInRangeExclusive: {
    shouldPass: [0.5, 0.2, 0.9],
    shouldFail: [0, 1, -0.001, 1.001, NaN, true, false, null]
  },
  isWord: {
    shouldPass: ['blue', 'NICE', 'jOyOuSlY', 'Gambolling'],
    shouldFail: ['19', 'multi-syllabic', '1990s', '67b', 19, NaN, true, false, null]
  },
  isHexString: {
    shouldPass: ['#fff', '#000', '#abc', '#E69', '#fff099', '#00bbCC'],
    shouldFail: ['#ff', '#0000', '##abc', '#', '#fff09', '#00bbCC1', '789', NaN, true, false, null]
  },
  isRGBString: {
    shouldPass: ['rgb(0,0,0)', 'rgb(255, 255, 255)'],
    shouldFail: ['rgb()', 'rgba(0, 0, 0, 0)', NaN, true, false, null]
  },
  isRGBAString: {
    shouldPass: ['rgba(0,0,0,1)', 'rgba(255, 255, 255, 0.5)'],
    shouldFail: ['rgb(0,0,0)', 'rgb(255, 255, 255)', NaN, true, false, null]
  },
  isHSLString: {
    shouldPass: ['hsl(20, 30%, 100%)', 'hsl(0.5, 0%, 13.5%)', 'hsl(-137.25, 22%, 62%)'],
    shouldFail: ['hsl(20, 30, 100)', NaN, true, false, null]
  },
  isHSLAString: {
    shouldPass: ['hsla(20, 30%, 100%, 20%)', 'hsla(0.5, 0%, 13.5%, 0.2)', 'hsla(-137.25, 22%, 62%, 1)'],
    shouldFail: ['hsla(20, 30%, 100%)', 'hsla(0, 20, 50, 0)', NaN, true, false, null]
  },
  isCSSColorString: {
    shouldPass: ['blue', '#fff', 'rgb(0,0,0)', 'rgba(255, 255, 255, 0.5)'],
    shouldFail: [NaN, true, false, null]
  }
}

for (let fn in tests) {
  test(`${fn}`, t => {
    t.throws(() => v[fn]()) // throws if called without a value
    tests[fn].shouldPass.forEach(val => t.true(v[fn](val)))
    tests[fn].shouldFail.forEach(val => t.false(v[fn](val)))
  })
}

const rangeTests = {
  isNumberInRangeInclusive: {
    shouldPass: [
      [0, [-1, 1]],
      [300, [0, 300]],
      [-0.3, [-0.7, -0.1]],
      [Infinity, [-Infinity, Infinity]]
    ],
    shouldFail: [
      [-2, [-1, 1]],
      [301, [0, 300]],
      [-0.09, [-0.7, -0.1]]
    ]
  },
  isNumberInRangeExclusive: {
    shouldPass: [
      [0, [-1, 1]],
      [-0.3, [-0.7, -0.1]]
    ],
    shouldFail: [
      [300, [0, 300]],
      [-2, [-1, 1]],
      [301, [0, 300]],
      [-0.09, [-0.7, -0.1]],
      [Infinity, [-Infinity, Infinity]]
    ]
  }
}

for (var fn in rangeTests) {
  test(`${fn} (with custom ranges)`, t => {
    rangeTests[fn].shouldPass.forEach(args => t.true(v[fn](...args)))
    rangeTests[fn].shouldFail.forEach(args => t.false(v[fn](...args)))
  })
}
