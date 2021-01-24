import chalk from 'chalk'
import fs from 'fs'
import {
  makeFilesArray,
  makeData,
  makeJson,
  makeIndexHtml,
} from './util/make.js'

// only do this if we have the dir to work from
// (_html contains exported files and gets removed post-copy)
if (fs.existsSync(process.env.HTMLDIR)) {
  const filesArray = makeFilesArray(process.env.HTMLDIR)
  // make the recipes object
  const recipes = makeData(filesArray)

  // sort the batches by date
  for (const recipe in recipes) {
    recipes[recipe].batches.sort((a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1
    )
  }

  // make a recipes json file in public dir
  makeJson(recipes)
  // make index.html
  if (makeIndexHtml(recipes)) console.log(chalk.green('index.html created.'))

  // now that we've sanizied and moved the files to public
  // we can remove the source dir
  console.log('Removing root _html directory...')
  try {
    fs.rmdirSync(process.env.HTMLDIR, { recursive: true })
    console.log('Removed.')
  } catch (err) {
    console.log(chalk.red(`Could not remove ${process.env.HTMLDIR}`))
    console.error(err)
  }
} else {
  // this is for working with express server
  console.log('Reading from JSON...')
  try {
    const recipes = JSON.parse(
      fs.readFileSync(process.env.PUBLIC + 'recipes.json', 'utf8')
    )
    if (recipes) {
      if (makeIndexHtml(recipes)) console.log('index.html created from json.')
    }
  } catch (err) {
    console.log(chalk.red('Cound not read json file - got error:'))
    console.error(err)
    process.exit(1)
  }
}
