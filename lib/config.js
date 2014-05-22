var Promise = require('es6-promise').Promise
  , path = require('path')
  , fs = require('fs')
  , osenv = require('osenv')

var defaultConfigPath = path.resolve(osenv.home(), '.gyazo.json')

function searchConfig(dir) {
  dir = dir || process.cwd()

  var currentPath = path.resolve(dir, '.gyazo.json')

  return new Promise(function (resolve, reject) {
    fs.exists(currentPath, function (exists) {
      if (exists) return resolve(currentPath)

      var parentDir = path.resolve(dir, '..')

      if (parentDir.length < osenv.home().length) return resolve()

      searchConfig(parentDir).then(resolve, reject)
    })
  })
}

var read = exports.read = function () {
  return searchConfig().then(function (configPath) {
    if (!configPath) return '{}'

    return new Promise(function (resolve, reject) {
      fs.readFile(configPath, { encoding: 'utf8' }, function (err, file) {
        if (err) reject(err)
        resolve(file || '{}')
      })
    })
  }).then(JSON.parse)
}

var write = exports.write = function (object) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(defaultConfigPath, object, function (err) {
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
