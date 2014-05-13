var request = require('request')
  , fs = require('fs')
  , path = require('path')

var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')
var upload = exports.upload = function (imagePath, callback) {
  var requestStream =
    request.post('https://gyazo.com/upload.cgi', function (err, res, url) {
      if (err) throw err

      if(callback) callback(null, url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idFilePath))
  form.append('imagedata', fs.createReadStream(imagePath))
}

exports.uploadIfExists = function (imagePath, callback) {
  fs.exists(imagePath, function (exists) {
    if (!exists) {
      console.error('File does not exist:', imagePath)
      process.exit(1)
    }

    upload(imagePath, callback)
  })
}
