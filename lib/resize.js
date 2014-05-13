var exec = require('child_process').exec

module.exports = function resizeIfRetina(imagePath, callback) {
  function sips(property, callback) {
    exec('sips -g ' + property + ' ' + imagePath + ' | awk \'/:/ {print $2}\'',
      function (err, stdout) {
        callback(Number(stdout))
      }
    )
  }

  function dpi(callback) {
    sips('dpiWidth', function (width) {
      sips('dpiHeight', function (height) {
        callback({ width: width, height: height })
      })
    })
  }

  function pixel(callback) {
    sips('pixelWidth', function (width) {
      sips('pixelHeight', function (height) {
        callback({ width: width, height: height })
      })
    })
  }

  function resize(width, height, callback) {
    exec('sips -s dpiWidth 72 -s dpiHeight 72 -z ' + height + ' ' + width + ' ' + imagePath, function () {
      callback()
    })
  }

  dpi(function (dpi) {
    if (dpi.width > 72.0 && dpi.height > 72.0) {
      pixel(function (pixel) {
        var width = pixel.width * 72.0 / dpi.width
          , height = pixel.height * 72.0 / dpi.height

        resize(width, height, callback)
      })
    } else {
      callback()
    }
  })
}
