const VLDT = require('@delucis/aproba')

module.exports = (function () {
  'use strict'

  const _mapToArr = m => { VLDT('M', [m]); return [...m.entries()] }
  const _setToArr = s => { VLDT('C', [s]); return [...s] }
  const _converters = new Map([
    [Map, _mapToArr],
    [Set, _setToArr]
  ])
  const _toArr = d => _converters.get(d.constructor)(d)

  /**
   * Make a function that uses an array method for an ES2015 data type
   * @param   {Map|Set}     collection  Data to process
   * @param   {String}      fn    The name of the method to call, e.g. 'filter'
   * @param   {Constructor} Type  Constructor for collection type to process
   * @param   {Object}      [o]   Options
   * @param   {Boolean} [o.convertMapArgs=false]  Convert passed args to arrays
   * @param   {String}  [o.validator]             An aproba validation schema
   * @param   {Boolean} [o.validateEach=false]    Use validator for each arg
   * @param   {*}       args      Remaining arguments are passed on
   * @return  {Map|Set} Result of the array method converted back to source type
   */
  const _makeArrFn = (
    collection,
    fn,
    {
      convertArgs = false,
      validator,
      validateEach
    },
    ...args
  ) => {
    validateEach ? args.forEach(a => VLDT(validator, [a])) : VLDT(validator, args)
    if (convertArgs) {
      args = args.map(arg => {
        const argType = arg.constructor
        if (_converters.has(argType)) {
          return _toArr(arg)
        } else {
          return arg
        }
      })
    }
    const Type = collection.constructor
    return new Type(_converters.get(Type)(collection)[fn](...args))
  }

  /**
   * Convert an array of function definitions to an object of methods
   * @param   {Array[]} defs        Function definitions
   * @param   {String}  defs[][0]   Name of method to generate function for
   * @param   {Object}  defs[][1]   Options to pass to function generator
   * @param   {Object}  o
   * @param   {String}  o.validator Aproba schema for collection type
   * @return  {Object}  Object with a property for each `defs` member
   */
  const _makeArrFns = (defs, { validator }) => {
    return defs.reduce(
      (fns, [fn, opts]) => {
        fns[fn] = (collection, ...args) => {
          VLDT(validator, [collection])
          return _makeArrFn(collection, fn, opts, ...args)
        }
        return fns
      },
      {}
    )
  }

  /**
   * Generate map array methods
   */
  const _arrFns = _makeArrFns(
    [
      ['concat', { convertArgs: true, validator: 'A|M|C', validateEach: true }],
      ['filter', { validator: 'F' }],
      ['map', { validator: 'F' }],
      ['slice', { validator: 'N|NN' }]
    ],
    {
      validator: 'M|C'
    }
  )

  return {
    /**
     * Methods for processing maps with array methods
     * @type {Object}
     */
    map: Object.assign(
      {
        toArr: _mapToArr
      },
      _arrFns
    ),
    /**
     * Methods for processing sets with array methods
     * @type {Object}
     */
    set: Object.assign(
      {
        toArr: _setToArr
      },
      _arrFns
    )
  }
}())
