var tmp = require('tmp')
  , exec = require('child_process').exec

module.exports = function screencapture(filePath, callback) {
  if (typeof filePath === 'function') {
    callback = filePath
    filePath = null
  }

  if (filePath) {
    return exec('screencapture -i ' + filePath, function () {
      callback(null, filePath)
    })
  } else {
    tmp.file(function (err, tmpPath) {
      filePath = tmpPath
      exec('screencapture -i ' + filePath, function () {
        callback(null, filePath)
      })
    })
  }
}
