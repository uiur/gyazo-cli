# gyazo(1)
Gyazo for hackers.

![ninja cat](http://i.gyazo.com/4127de4be736f098edf9492f6cdf4925.gif)

Available on Mac only for now.

### Usage

``` bash
gyazo
gyazo /path/to/your/image.png
gyazo 1.png 2.png 3.png
gyazo image.gif
gyazo http://google.com/doodle.png
gyazo --times 3
gyazo --quiet
```

### Installation
not yet
``` bash
npm install -g gyazo-cli
```

### TODO

``` bash
gyazo > output.png
echo 'input.png' | gyazo
gyazo --host http://gyazo.yourhost.com/
gyazo --id /your/idfile

# gif
gyazo video.mp4

# config
# .gyazoconfig
gyazo config host http://gyazo.yourcompany.com
gyazo config id /your/idfile
gyazo config quiet true
```

### LICENSE
MIT
