var Promise = require('es6-promise').Promise
  , resizeIfRetina = require('./resize')
  , screencapture = require('screencapture')

/*
   Capture a screenshot and resolve with the image path

   @param {String} [filePath]
   @return {Promise}
*/
module.exports = function (filePath) {
  return new Promise(function (resolve, reject) {
    screencapture(filePath, function (err, imagePath) {
      if (err) reject(err)

      resizeIfRetina(imagePath, function () {
        resolve(imagePath)
      })
    })
  })
}
