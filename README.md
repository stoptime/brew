[![Netlify Status](https://api.netlify.com/api/v1/badges/7be85a23-6482-488f-881e-373009a9a12e/deploy-status)](https://app.netlify.com/sites/priceless-feynman-0924dc/deploys) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Relax, have a homebrew.

My homebrew software is able to export my recipes and batches/variations of recipes as html files.

I use this data to practice filesystem operations in various programming languages and then generate an html listing page, which you can see here:

https://brew.mattmayes.com/

Super handy to have that at my fingertips if I'm shopping for ingredients or someone asks about a beer. If you're brewing with Chicago water - many of these recipes, like Lil Slozhun IPA, have water treatment notes (and dang that's a good IPA 😋).

### How it works

This version is written in Node.js - and basically does the following:

1. Looks for directory `_html` in the root of the project.
2. If it finds it, sanitizes each filename so it is url friendly (since we just link right to it).
3. It then saves the renamed file into the `public/_html` directory, and when done, removes the original directory so it is not processed everytime the "make" script is run. _(We only want to parse all those files when a fresh export is present.)_
4. While parsing the files, the program also determines if a file is a batch or recipe, and scrapes data from each html page like the title, date, etc. While doing this it creats a big "recipe" object with all the data, and lastly sorts each recipe's batches by date.
5. It takes that data, and makes a `public/recipes.json` file, which is used as the data source if you want to start the express server to work on the pug template (or use it for whatever else).
6. Lastly, use pug to generate a static `public/index.html` file.

<p align="center">🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻 🍻</p>
