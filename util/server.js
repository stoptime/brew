import express from 'express'
import { readFileSync } from 'fs'

const app = express()
const port = process.env.PORT || 3000

const recipesObject = JSON.parse(
  readFileSync(process.env.PUBLIC + 'recipes.json', 'utf8')
)

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', function (req, res) {
  res.render('recipes', { recipes: recipesObject })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
