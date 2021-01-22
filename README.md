[![Netlify Status](https://api.netlify.com/api/v1/badges/7be85a23-6482-488f-881e-373009a9a12e/deploy-status)](https://app.netlify.com/sites/priceless-feynman-0924dc/deploys) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Relax, have a homebrew.

My homebrew software is able to export my recipes and batches/variations of recipes as html files.

I use this data to practice filesystem operations in various programming languages and then generate an html listing page, which you can see here:

https://brew.mattmayes.com/

### How it works

This version is written in Node.js - and basically does the following:

1. Looks for directory `_html` in the root of the project.
2. If it finds it, will read through the directory, and rename the files so they are url friendly.
3. It will then copy those files into the `public/_html` directory, and remove the original directory so it is not processed everytime the "make" script is run. _(We only want to parse all those files when a fresh export is present.)_
4. While it was parsing the files, the program was also determining what file is a batch and what is a recipe, and scraping data from each html page like the title, date, etc. While doing this is created a big "recipe" object with all the data, and sorts each recipe's batches by date.
5. It takes that data, and makes a `public/recipes.json` file, which is used if you want to start the express server and work on the pug template.
6. It then uses the pug template to generate a static `public/index.html` file.

<p align="center">🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻</p>
