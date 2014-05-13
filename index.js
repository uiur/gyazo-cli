#!/usr/bin/env node

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , resizeIfRetina = require('./lib/resize')
  , upload = require('./lib/upload')
  , optimist = require('optimist')

var argv = optimist
    .usage('Usage: $0')
    .describe('help', 'Print this')
    .alias('h', 'help')
    .argv

if (argv.help) {
  console.log(optimist.help())
  process.exit(0)
}

var input = argv._[0]

if (input) {
  var inputPath = input
  fs.exists(path.join(process.cwd(), inputPath), function (exists) {
    if (!exists) {
      console.error('File does not exist:', inputPath)
      process.exit(1)
    }

    upload(inputPath, function () {
      process.exit(0)
    })
  })
} else {
  tmp.file(function (err, imagePath) {
    if (err) throw err

    exec('screencapture -i ' + imagePath, function (err) {
      if (err) throw err

      resizeIfRetina(imagePath, function () {
        upload(imagePath, function () {
          process.exit(0)
        })
      })
    })
  })
}
