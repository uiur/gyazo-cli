#!/usr/bin/env node

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , resizeIfRetina = require('./lib/resize')
  , request = require('request')
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

function upload(idFilePath, imagePath) {
  var requestStream =
    request.post('https://gyazo.com/upload.cgi', function (err, res, url) {
      exec(['echo', url , '| pbcopy'].join(' '))
      exec('open ' + url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idFilePath))
  form.append('imagedata', fs.createReadStream(imagePath))
}

var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')

var input = argv._[0]

if (input) {
  var inputPath = input
  fs.exists(path.join(process.cwd(), inputPath), function (exists) {
    if (!exists) {
      console.error('File does not exist:', inputPath)
      process.exit(1)
    }

    upload(idFilePath, inputPath)
  })
} else {
  tmp.file(function (err, imagePath) {
    if (err) throw err

    exec('screencapture -i ' + imagePath, function (err) {
      if (err) throw err

      resizeIfRetina(imagePath, function () {
        upload(idFilePath, imagePath)
      })
    })
  })
}
