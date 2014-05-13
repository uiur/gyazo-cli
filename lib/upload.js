var request = require('request')
  , exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')

var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')

module.exports = function upload(imagePath, callback) {
  var requestStream =
    request.post('https://gyazo.com/upload.cgi', function (err, res, url) {
      exec(['echo', url , '| pbcopy'].join(' '))
      exec('open ' + url)
      callback(url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idFilePath))
  form.append('imagedata', fs.createReadStream(imagePath))
}
