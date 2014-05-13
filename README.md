# gyazo(1)
Gyazo for hackers.

Available on Mac only for now.

### Usage

``` bash
gyazo
gyazo /path/to/your/image.png
gyazo 1.png 2.png 3.png
gyazo --times 3
gyazo http://google.com/doodle.png
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
gyazo --quiet

# gif
gyazo video.mp4
gyazo image.gif

# config
# .gyazoconfig
gyazo config host http://gyazo.yourcompany.com
gyazo config id /your/idfile
gyazo config quiet true
```

### LICENSE
MIT
