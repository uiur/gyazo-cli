// Upload an image from stream

var request = require('request')
  , fs = require('fs')
  , path = require('path')
  , stream = require('stream')

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

upload(stream, function (err, url) {
  console.log(url)
})

upload(stream, { host: 'http://syazo.com', id: '/idpath' }, function (err, url) {

})

var upload = exports.upload = function (imagePath, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var imageStream = imagePath instanceof stream.Readable
                  ? imagePath
                  : fs.createReadStream(imagePath)


  var requestStream =
    request.post(uploadURL(process.env.GYAZO_HOST), function (err, res, url) {
      if (err) throw err

      if(callback) callback(null, url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idPath()))
  form.append('imagedata', imageStream)
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
