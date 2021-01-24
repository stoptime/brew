import sinon from 'sinon'
import fs from 'fs-extra'
import { makeFilesArray, makeData, makeJson, makeIndexHtml } from '../util/make'
let filesArray

beforeAll(() => {
  sinon.stub(process.env, 'HTMLDIR').value('./__test__/html/')
  sinon.stub(process.env, 'PUBLIC').value('./__test__/public/')
  sinon.stub(process.env, 'PUBLICHTMLDIR').value('./__test__/public/html/')
  try {
    if (!fs.existsSync(process.env.HTMLDIR)) {
      try {
        fs.copySync('./__test__/html-copy', process.env.HTMLDIR)
      } catch (err2) {
        throw err2
      }
    }
  } catch (err) {
    throw err
  }
  filesArray = makeFilesArray(process.env.HTMLDIR)
  console.log(filesArray)
})

test('environmental directories are mocked', () => {
  expect(process.env.HTMLDIR).toEqual('./__test__/html/')
  expect(process.env.PUBLIC).toEqual('./__test__/public/')
  expect(process.env.PUBLICHTMLDIR).toEqual('./__test__/public/html/')
})

test('files array is made and contains 5 files', () => {
  expect(filesArray.length).toEqual(5)
})

test('Filenames are correct and files exist in public html dir', () => {
  const fileNames = [
    'beggars-canyon-ipa-batch-5.html',
    'beggars-canyon-ipa.html',
    'myburger-12gal-batch-1.html',
    'myburger-12gal.html',
    'saisoon-bufoon-randy-batch-1.html',
  ]
  const pubHtmlFiles = fs.readdirSync(process.env.PUBLICHTMLDIR)
  for (const file of fileNames) {
    expect(pubHtmlFiles.includes(file)).toBeTruthy()
  }
})

afterAll(() => {
  sinon.restore()
})
