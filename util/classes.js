export class Recipe {
  /**
   * @param {string} name
   * @param {string} file
   * @param {Boolean} featured
   */
  constructor(name, file, featured = false) {
    this.name = name
    this.file = file
    this.batches = []
    this.featured = featured
  }
}

export class Batch {
  /**
   * @param {string} name
   * @param {string} file
   * @param {string} date
   * @param {string} fg - final gravity
   */
  constructor(name, file, date, fg) {
    this.name = name
    this.file = file
    this.date = date
    this.fg = fg
  }
}
