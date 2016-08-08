#!/usr/bin/env node

var jsonfile = require('jsonfile')
var path = require('path')
var program = require('commander')

var generator = require('../')

program
  .version(require('../package.json').version)
  .option('-s, --search [search string]', 'A browserslist string to use for generation')
  .option('-o, --output [filename]', 'File path for output json')
  .parse(process.argv)

generator(program.search)
.then(function (browsers) {
  if (program.output) {
    var filepath = path.join(process.cwd(), program.output)
    console.log('writing browsers to', filepath)
    jsonfile.writeFile(filepath, browsers, {spaces: 2}, function (error) {
      if (error) throw new Error(error)
    })
  } else {
    console.log(browsers)
  }
})
