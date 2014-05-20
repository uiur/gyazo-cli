var test = require('tape')

var fs = require('fs')
  , gyazo = require('../lib/gyazo')
  , server = require('./support/server')

var HOST = 'http://localhost:8888'

var options = { host: HOST, id: './test/support/id' }

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

test('upload with url', function (t) {
  t.plan(3)

  server.once('upload', function (result) {
    t.equal(result.id, fs.readFileSync('./test/support/id', 'utf8'))

    var nyancatSize = fs.createReadStream('./test/support/nyancat.png').size
    t.equal(result.imagedata.size, nyancatSize, 'url image should be uploaded')
  })

  gyazo(HOST + '/nyancat.png', options).then(function (urls) {
    t.equal(urls[0], 'url')
  })
})

// XXX:
setTimeout(function () {
  server.close()
}, 1000)
