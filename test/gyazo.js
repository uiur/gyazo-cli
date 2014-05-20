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
