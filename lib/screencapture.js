var tmp = require('tmp')
  , exec = require('child_process').exec
  , Promise = require('es6-promise').Promise
  , resizeIfRetina = require('./resize')

// a Promise wrapper for `tmp`
function tmpFile() {
  return new Promise(function (resolve, reject) {
    tmp.file(function (err, tmpPath) {
      if (err) reject(err)

      resolve(tmpPath)
    })
  })
}

function screencaptureWithFilePath(filePath) {
  return new Promise(function (resolve, reject) {
    exec('screencapture -i ' + filePath, function (err) {
      if (err) reject(err)

      resizeIfRetina(filePath, function () {
        resolve(filePath)
      })
    })
  })
}

/*
   Capture a screenshot and resolve with the image path

   @param {String} [filePath]
   @return {Promise}
*/
module.exports = function screencapture(filePath) {
  var filePathPromise = filePath ? Promise.resolve(filePath) : tmpFile()

  return filePathPromise.then(screencaptureWithFilePath)
}
