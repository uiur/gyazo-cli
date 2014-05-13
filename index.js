#!/usr/bin/env node

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , resizeIfRetina = require('./lib/resize')
  , upload = require('./lib/upload')
  , parallel = require('run-parallel')
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

function uploadFile(filePath, callback) {
  fs.exists(filePath, function (exists) {
    if (!exists) {
      console.error('File does not exist:', filePath)
      process.exit(1)
    }

    upload(filePath, callback)
  })
}

function pbcopy(text, callback) {
  callback = callback || function () {}
  exec(['echo', '"' + text + '"' , '| pbcopy'].join(' '), callback)
}

var inputs = argv._
if (inputs.length) {
  parallel(
    inputs.map(function (input) {
      return function (callback) {
        uploadFile(path.resolve(process.cwd(), input), callback)
      }
    })
  , function (err, urls) {
    if (err) throw err

    pbcopy(urls.join('\\n'))
    exec('open ' + urls.join(' '))
    process.exit(0)
  })

} else {
  tmp.file(function (err, imagePath) {
    if (err) throw err

    exec('screencapture -i ' + imagePath, function (err) {
      if (err) throw err

      resizeIfRetina(imagePath, function () {
        upload(imagePath, function (err, url) {
          pbcopy(url)
          exec('open ' + url)
          process.exit(0)
        })
      })
    })
  })
}
