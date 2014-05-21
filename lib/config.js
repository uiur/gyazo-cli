var Promise = require('es6-promise').Promise
  , path = require('path')
  , fs = require('fs')

var configPath = path.resolve(process.env.HOME, '.gyazo.json')

var read = exports.read = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile(configPath, { encoding: 'utf8' }, function (err, file) {
      if (err) reject(err)
      resolve(file || '{}')
    })
  }).then(JSON.parse)
}

var write = exports.write = function (object) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(configPath, object, function (err) {
      if (err) reject(err)
      resolve()
    })
  })
}

exports.readValue = function (key) {
  return read().then(function (json) {
    return json[key]
  })
}

exports.add = function (key, value) {
  return read().then(function (object) {
    object[key] = value
    return write(JSON.stringify(object, null, 2))
  })
}
