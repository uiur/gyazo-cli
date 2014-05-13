#!/usr/bin/env node

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , resizeIfRetina = require('./lib/resize')
  , request = require('request')

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

tmp.file(function (err, imagePath) {
  if (err) throw err

  exec('screencapture -i ' + imagePath, function (err) {
    if (err) throw err

    resizeIfRetina(imagePath, function () {
      upload(idFilePath, imagePath)
    })
  })
})
