var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , request = require('request')

var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')

exec('screencapture -i a.png', function () {
  var requestStream =
    request.post('http://gyazo.com/upload.cgi', function (err, res, body) {
      exec(['echo', body , '| pbcopy'].join(' '))
      exec('open ' + body)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idFilePath))
  form.append('imagedata', fs.createReadStream(path.join(__dirname, 'a.png')))
})
