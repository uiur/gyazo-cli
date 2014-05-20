var test = require('tape')

var fs = require('fs')
  , gyazo = require('../lib/gyazo')
  , server = require('./support/server')

var options = { host: 'http://localhost:8888', id: './test/support/id' }

test('upload with file path', function (t) {
  t.plan(3)

  server.once('upload', function (result) {
    t.equal(result.id, fs.readFileSync('./test/support/id', 'utf8'))
    t.ok(result.imagedata)
  })

  gyazo(__dirname + '/cat.gif', options).then(function (urls) {
    t.equal(urls[0], 'url')
  })
})

// XXX:
setTimeout(function () {
  server.close()
}, 1000)

// stub request
/*
request.post = function (url, callback) {
  requestURL = url

  process.nextTick(function () {
    if (callback) callback(null, {}, RES_URL)
  })

  return {
    form: function () {
      form = {}
      return {
        append: function (key, value) {
          form[key] = value
        }
      }
    }
  }
}

// stub id
fs.readFileSync = function () {
  return 'gyazo id'
}

test('upload', function (t) {
  t.plan(4)

  upload(__dirname + '/cat.gif', function (err, url) {
    t.equal(url, RES_URL)
  })

  t.equal(requestURL, 'http://upload.gyazo.com/upload.cgi')

  t.ok(form.imagedata)
  t.equal(form.id, 'gyazo id')
})

test('upload with host option', function (t) {
  t.plan(3)

  process.env.GYAZO_HOST = 'http://syazo.com/'

  upload(__dirname + '/cat.gif', function (err, url) {
    t.equal(url, RES_URL)
  })

  t.equal(requestURL, 'http://syazo.com/upload.cgi')

  process.env.GYAZO_HOST = 'http://syazo.com'
  upload(__dirname + '/cat.gif')

  t.equal(requestURL, 'http://syazo.com/upload.cgi')
})

test('upload with id option', function (t) {
  process.env.GYAZO_ID = '/path/to/idfile'

  var readPath
  fs.readFileSync = function (filePath) {
    readPath = filePath
    return 'gyazo id'
  }

  upload(__dirname + '/cat.gif')

  t.equal(readPath, '/path/to/idfile')

  t.end()
})

*/
