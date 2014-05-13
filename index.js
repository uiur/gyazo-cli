var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , request = require('request')

function upload(idFilePath, imagePath) {
  var requestStream =
    request.post('https://gyazo.com/upload.cgi', function (err, res, url) {
      exec(['echo', url , '| pbcopy'].join(' '))
      exec('open ' + url)
    })

  var form = requestStream.form()
  form.append('id', fs.readFileSync(idFilePath))
  form.append('imagedata', fs.createReadStream(imagePath))
}


var idFilePath = path.join(process.env.HOME, 'Library/Gyazo/id')

tmp.file(function (err, imagePath) {
  if (err) throw err

  exec('screencapture -i ' + imagePath, function (err) {
    if (err) throw err

    function sips(property, callback) {
      return exec('sips -g ' + property + ' ' + imagePath + ' | awk \'/:/ {print $2}\'', function (err, stdout) {
        callback(Number(stdout))
      })
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

    dpi(function (dpi) {
      if (dpi.width > 72.0 && dpi.height > 72.0) {
        pixel(function (pixel) {
          var width = pixel.width * 72.0 / dpi.width
            , height = pixel.height * 72.0 / dpi.height

          exec('sips -s dpiWidth 72 -s dpiHeight 72 -z ' + height + ' ' + width + ' ' + imagePath, function () {
            upload(idFilePath, imagePath)
          })
        })

        return
      }

      upload(idFilePath, imagePath)
    })

  })
})
