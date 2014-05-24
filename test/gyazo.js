var test = require('tape')

var gyazo = require('../lib/gyazo')

test('gyazo', function (t) {
  t.ok(typeof gyazo === 'function')
  t.end()
})
