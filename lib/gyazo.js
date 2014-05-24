var screencapture = require('./screencapture')
  , Promise = require('es6-promise').Promise
  , clip = require('cliparoo')
  , upload = require('gyazo-upload')
  , open = require('open')

function clipURLs(urls) {
  return new Promise(function (resolve, reject) {
    clip(urls.join('\\\\n'), function (err) {
      if (err) reject(err)

      resolve(urls)
    })
  })
}

function openURLs(urls) {
  urls.forEach(function (url) {
    open(url)
  })
}

// Take screenshots N times
function sequenceScreencapture(times) {
  return new Promise(function (resolve, reject) {
    var promise = Promise.resolve()
    var paths = []

    for (var i = 0; i < times; i++) {
      promise = promise
        .then(screencapture)
        .then(function (imagePath) {
          if (imagePath) paths.push(imagePath)
        })
    }

    promise.then(function () {
      resolve(paths)
    }, reject)
  })
}

/*
   Take a screenshot, upload, clip and open urls.

   @param {[String or Stream]} [inputs]
   @param {Object} [options]
*/
module.exports = function gyazo(inputs, options) {
  options = options || {}

  if (typeof inputs === 'object' && !Array.isArray(inputs)) {
    options = inputs
    inputs = null
  }

  var times = options.times ? options.times : 1

  var imagesPromise = inputs
                    ? Promise.resolve(inputs)
                    : sequenceScreencapture(times)

  return imagesPromise.then(function (inputs) {
    return upload(inputs, options)
  })
    .then(clipURLs)
    .then(function (urls) {
      if (options.quiet) return

      return openURLs(urls)
    })
}
