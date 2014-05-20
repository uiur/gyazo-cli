var request = require('request')
  , fs = require('fs')
  , path = require('path')
  , stream = require('stream')
  , url = require('url')
  , Promise = require('es6-promise').Promise

function uploadURL(host) {
  host = host || 'http://upload.gyazo.com'
  host = host.replace(/\/$/, '')

  return host + '/upload.cgi'
}

function idPath(optionPath) {
  return optionPath
         ? path.resolve(process.cwd(), optionPath)
         : path.resolve(process.env.HOME, 'Library/Gyazo/id')
}

function isURL(str) {
  return !!url.parse(str).host
}

/* Upload stream

   @param {ReadableStream} stream
   @param {Object} options - id, host
   @return {Promise}
*/
function upload(stream, options) {
  options = options || {}

  return new Promise(function (resolve, reject) {
    var requestStream =
      request.post(uploadURL(options.host), function (err, res, url) {
        if (err) reject(err)

        resolve(url)
      })

    var form = requestStream.form()

    form.append('imagedata', stream)
    form.append('id', fs.readFileSync(idPath(options.id)))
  })
}

/* Upload input images and invoke callback with urls

   @param {[String or Stream]} inputs
                               - file path, url or stream, or an array of them
   @param {Object} options - id, host, output
   @return {Promise}
*/
module.exports = function gyazo(inputs, options) {
  if (!Array.isArray(inputs)) {
    inputs = [inputs]
  }

  var uploads = inputs.map(function (input) {
    var imageStream

    if (input instanceof stream.Readable) {
      imageStream = input
    } else if (isURL(input)) {
      var url = input

      imageStream = request(url)
    } else {
      imageStream = fs.createReadStream(input)
    }

    return upload(imageStream, options)
  })

  return Promise.all(uploads)
}
