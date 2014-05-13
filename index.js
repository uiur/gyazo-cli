var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , request = require('request')

var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')

tmp.file(function (err, imagePath) {
  if (err) throw err

  exec('screencapture -i ' + imagePath, function () {
    var requestStream =
      request.post('https://gyazo.com/upload.cgi', function (err, res, body) {
        exec(['echo', body , '| pbcopy'].join(' '))
        exec('open ' + body)
      })

    var form = requestStream.form()
    form.append('id', fs.readFileSync(idFilePath))
    form.append('imagedata', fs.createReadStream(imagePath))
  })
})
