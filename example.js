var fs = require('fs')
  , gyazo = require('./lib/gyazo')

gyazo([
  __dirname + '/../output.png',
  'http://s3.amazonaws.com/i.jpg.to/l/153',
  fs.createReadStream(__dirname + '/../output.png')
], {
  host: 'http://localhost:3000/',
  id: '../../Library/Gyazo/idlocal'
}).then(function (urls) {
  console.log(urls)
}).catch(function (err) {
  console.log(err)
})
