var multiparty = require('multiparty')
  , http = require('http')

var server = module.exports = http.createServer(function(req, res) {
  if (req.url === '/upload.cgi' && req.method === 'POST') {
    var form = new multiparty.Form()

    form.parse(req, function(err, fields, files) {
      server.emit('upload', { id: fields.id[0], imagedata: files.imagedata })
      res.writeHead(200, {'content-type': 'text/plain'})
      res.end('url')
    })
  }
}).listen(8888)
