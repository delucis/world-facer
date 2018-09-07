/**
 * Class for constructing custom error types
 * @extends Error
 */
module.exports = class CustomError extends Error {
  /**
   * Create a new custom error
   * @param {String} name The name of the custom error type, e.g. 'CustomError'
   * @param {String} msg  The error message passed to the Error prototype
   */
  constructor (name, msg) {
    super(msg)
    this.name = name
  }
}
