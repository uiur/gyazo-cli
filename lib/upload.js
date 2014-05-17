var request = require('request')
  , fs = require('fs')
  , path = require('path')

function uploadURL(host) {
  host = host || 'http://upload.gyazo.com'
  host = host.replace(/\/$/, '')

  return host + '/upload.cgi'
}

function idPath() {
  return path.resolve(
    process.env.HOME, process.env.GYAZO_ID || 'Library/Gyazo/id'
  )
}

var upload = exports.upload = function (imagePath, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var requestStream =
    request.post(uploadURL(process.env.GYAZO_HOST), function (err, res, url) {
      if (err) throw err

      if(callback) callback(null, url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idPath()))
  form.append('imagedata', fs.createReadStream(imagePath))
}

exports.uploadIfExists = function (imagePath, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  fs.exists(imagePath, function (exists) {
    if (!exists) {
      console.error('File does not exist:', imagePath)
      process.exit(1)
    }

    upload(imagePath, callback)
  })
}
