import express from 'express'
import { readFileSync } from 'fs'

const app = express()
const port = process.env.PORT || 3000

const recipesObject = JSON.parse(
  readFileSync(process.env.PUBLIC + 'recipes.json', 'utf8')
)

// app.use(express.static('./public'))

app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('recipes', { recipes: recipesObject })
})

app.get('/recipes.json', (req, res) => {
  res.json(recipesObject)
})

app.get('/_html/*', (req, res) => {
  console.log(req.params)
  res.sendFile(req.params[0], { root: './public/_html' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
