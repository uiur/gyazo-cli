#!/usr/bin/env node

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , tmp = require('tmp')
  , upload = require('./lib/upload').upload
  , uploadIfExists = require('./lib/upload').uploadIfExists
  , parallel = require('run-parallel')
  , series = require('run-series')
  , optimist = require('optimist')
  , url = require('url')
  , request = require('request')
  , screencapture = require('./lib/screencapture')

var argv = optimist
    .usage('Usage: $0')
    .describe('help', 'Print this')
    .describe('version', 'Show version')
    .describe('times', 'Screenshot N times and upload them all')
    .describe('quiet', 'Don\'t open an image in browser (Copy url only)')
    .describe('output', 'Write screenshot to an output file (also upload)')
    .describe('host', 'Specify a host url to which you upload')
    .describe('id', 'Specify a device id')
    .alias('h', 'help')
    .alias('v', 'version')
    .alias('t', 'times')
    .alias('q', 'quiet')
    .alias('o', 'output')
    .argv

if (argv.help) {
  console.log(optimist.help())
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

if (argv.host) {
  process.env.GYAZO_HOST = argv.host
}

if (argv.id) {
  process.env.GYAZO_ID = argv.id
}

var stdinReadable
process.stdin.on('readable', function () {
  stdinReadable = true
})

function pbcopy(text, callback) {
  callback = callback || function () {}
  exec(['echo', '"' + text + '"' , '| pbcopy'].join(' '), callback)
}

function openURL(url) {
  if (argv.quiet) return

  exec('open ' + url)
}

function openURLs(urls) {
  if (argv.quiet) return

  exec('open ' + urls.join(' '))
}

function isURL(str) {
  return !!url.parse(str).host
}

function fetchURL(url, callback) {
  tmp.file(function (err, tmpPath) {
    var ws = fs.createWriteStream(tmpPath)
    request(url).pipe(ws)
    ws.on('finish', function () {
      callback(tmpPath)
    })
  })
}

// upload from url or path
var inputs = argv._
if (inputs.length) {
  parallel(
    inputs.map(function (input) {
      return function (callback) {
        if (isURL(input)) {
          fetchURL(input, function (imagePath) {
            upload(imagePath, callback)
          })

          return
        }

        uploadIfExists(path.resolve(process.cwd(), input), callback)
      }
    })
  , function (err, urls) {
    if (err) throw err

    pbcopy(urls.join('\\n'))
    openURLs(urls)
    process.exit(0)
  })

  return
}

// screencapture N times and upload
if (argv.times) {
  var times = argv.times
  var tasks = []
  for (var i = 0; i < times; i++) {
    tasks.push(function (callback) {
      screencapture(callback)
    })
  }

  series(tasks, function (err, paths) {
    if (err) throw err

    var uploadTasks = paths.map(function (path) {
      return function (callback) {
        upload(path, callback)
      }
    })

    parallel(uploadTasks, function (err, urls) {
      if (err) throw err

      pbcopy(urls.join('\\n'))
      openURLs(urls)
      process.exit(0)
    })
  })

  return
}

// upload from stdin
tmp.file(function (err, tmpPath) {
  var ws = fs.createWriteStream(tmpPath)
  process.stdin.pipe(ws)
  process.stdin.on('end', function () {
    upload(tmpPath, function (err, url) {
      pbcopy(url)
      openURL(url)
      process.exit(0)
    })
  })
})

if (!stdinReadable) return

var imagePath = null
if (argv.output) {
  imagePath = path.resolve(process.cwd(), argv.output)
}

screencapture(imagePath, function (err, imagePath) {
  upload(imagePath, function (err, url) {
    pbcopy(url)
    openURL(url)
    process.exit(0)
  })
})
