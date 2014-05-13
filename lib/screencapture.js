var tmp = require('tmp')
  , exec = require('child_process').exec
  , resizeIfRetina = require('./resize')

function screencaptureWithFilePath(filePath, callback) {
  return exec('screencapture -i ' + filePath, function (err) {
    if (err) throw err

    resizeIfRetina(filePath, function () {
      callback(null, filePath)
    })
  })
}

module.exports = function screencapture(filePath, callback) {
  if (typeof filePath === 'function') {
    callback = filePath
    filePath = null
  }

  if (filePath) {
    screencaptureWithFilePath(filePath, callback)
  } else {
    tmp.file(function (err, tmpPath) {
      screencaptureWithFilePath(tmpPath, callback)
    })
  }
}
