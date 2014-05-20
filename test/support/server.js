var multiparty = require('multiparty')
  , http = require('http')
  , EventEmitter = require('events').EventEmitter

var server = new EventEmitter()

http.createServer(function(req, res) {
  if (req.url === '/upload.cgi' && req.method === 'POST') {
    var form = new multiparty.Form()

    form.parse(req, function(err, fields, files) {
      server.emit('upload', { id: fields.id, imagedata: files.imagedata })
      res.writeHead(200, {'content-type': 'text/plain'})
      res.end()
    })
  }
}).listen(8888)


module.exports = server
