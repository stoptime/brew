import fs from 'fs'
import cheerio from 'cheerio'
import chalk from 'chalk'
import pug from 'pug'
import { Recipe, Batch } from './classes.js'

const featuredRecipes = [
  'daggertooth',
  'lil-splozhun-ipa',
  'eagle-stout',
  'joostice-neipa',
  'tof-joe-ipa',
]

/**
 * Is this a recipe?
 * If not it's a batch
 * @param {string} fileName
 * @returns {Boolean}
 */
function isRecipe(fileName) {
  return !fileName.includes('batch')
}

function isFeaturedRecipe(slug) {
  return featuredRecipes.includes(slug)
}

/**
 * Pull <title> out of html file
 * @param {Buffer} data
 * @returns {string}
 */
function getTitle(data) {
  try {
    const $ = cheerio.load(data)
    return $('title').text().trim()
  } catch (err) {
    console.error(`getTitle failed: ${data}`, err)
  }
}

function redoPublicHtmlFolder() {
  // remove the prev public html dir
  // and make it again
  if (fs.existsSync(process.env.PUBLICHTMLDIR)) {
    try {
      fs.rmdirSync(process.env.PUBLICHTMLDIR, { recursive: true })
    } catch (err) {
      console.log(
        chalk.red(`Could not remove dir: ${process.env.PUBLICHTMLDIR}`)
      )
    }
  }
  try {
    fs.mkdirSync(process.env.PUBLICHTMLDIR)
  } catch (err) {
    console.log(chalk.red(`Could not make ${process.env.PUBLICHTMLDIR}`))
    console.error(err)
    process.exit(1)
  }
}

/**
 * Sanitizes the file names and renames file
 * the copies file into public html dir
 * @param {string} fileName
 * @returns {string | void} sanitized filename or console
 */
function saniRenameCopy(fileName) {
  const replaceName = fileName
    .replace("'", '')
    .replace('(', '')
    .replace(')', '')
    .replace(/[^a-z0-9.]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

  try {
    fs.renameSync(
      process.env.HTMLDIR + fileName,
      process.env.PUBLICHTMLDIR + replaceName
    )
    return replaceName
  } catch (err) {
    return console.error(
      chalk.red(`Error renaming ${fileName} to ${replaceName}`)
    )
  }
}

/**
 *
 * @param {string | Buffer} data
 * @param {string} file
 * @returns {Batch}
 */
function makeBatch(data, file) {
  const $ = cheerio.load(data)

  const title = $('title').text()
  const date = $(
    'body table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(2)'
  )
    .text()
    .trim()
  const fg = $(
    'body > table:nth-child(14) > tbody > tr:nth-child(8) > td:nth-child(4)'
  )
    .text()
    .trim()
    .replace('SG', 'FG')

  return new Batch(title, file, date, fg)
}

/**
 * Copy and sanitize files in _html to public/_html
 * and return the renamed files in an array
 * @returns {Array}
 * @param dir
 */
export function makeFilesArray(dir) {
  try {
    // clean out existing files
    redoPublicHtmlFolder()
    const returnArray = fs.readdirSync(dir).map(saniRenameCopy)
    fs.rmdirSync(dir, { recursive: true })
    return returnArray
  } catch (err) {
    console.log(chalk.red(`Could not read and/or rm directory: ${dir}`), err)
    process.exit(1)
  }
}

/**
 *
 * @param {Array} filesArray - file array from makeFilesArray
 * @returns {Object} recipes with batches
 */
export function makeData(filesArray) {
  const recipes = {}
  for (const file of filesArray) {
    const data = fs.readFileSync(process.env.PUBLICHTMLDIR + file, 'utf8')
    try {
      if (isRecipe(file)) {
        const slugArray = file.split('.')
        if (!(slugArray[0] in recipes)) {
          const title = getTitle(data)
          const featured = isFeaturedRecipe(slugArray[0])
          recipes[slugArray[0]] = new Recipe(title, file, featured)
        }
      } else {
        // what's the parent recipe, and is it in the recipes object?
        // if not, put it in
        const recipeSlugArray = file.split('-batch')
        if (!(recipeSlugArray[0] in recipes)) {
          try {
            const recipeFile = recipeSlugArray[0] + '.html'
            const recipeData = fs.readFileSync(
              process.env.PUBLICHTMLDIR + recipeFile
            )
            const title = getTitle(recipeData)
            const featured = isFeaturedRecipe(recipeSlugArray[0])
            recipes[recipeSlugArray[0]] = new Recipe(
              title,
              recipeFile,
              featured
            )
          } catch (err) {
            console.log(
              chalk.red(
                'Unable to read: ' +
                  process.env.PUBLICHTMLDIR +
                  recipeSlugArray[0] +
                  '.html'
              )
            )
            console.error(err)
            process.exit(1)
          }
        }
        // now make the batch from 'data' and insert into recipes
        try {
          recipes[recipeSlugArray[0]].batches.push(makeBatch(data, file))
        } catch (err) {
          console.log(chalk.red('Could not make batch', file))
          console.error(err)
        }
      }
    } catch (err) {
      console.log(err)
      console.error(chalk.red(`isRecipe() failed for file: ${file}`))
    }
  }
  return recipes
}

export function makeIndexHtml(recipes) {
  try {
    const html = pug.renderFile('./views/recipes.pug', { recipes: recipes })
    fs.writeFileSync(process.env.PUBLIC + 'index.html', html)
    return true
  } catch (err) {
    console.log(chalk.red('Could not create index.html - got error:'))
    console.error(err)
  }
}

export function makeJson(obj) {
  const file = fs.createWriteStream(process.env.PUBLIC + 'recipes.json')
  try {
    file.write(JSON.stringify(obj))
    console.log(chalk.cyan('recipes.json created'))
  } catch (err) {
    console.log(chalk.red('Could not write json file'))
    console.error(err)
  }
}
