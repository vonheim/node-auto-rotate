# auto-rotate
Auto rotate JPEG images based on their EXIF Orientation tag. Promise based API.


## Installation

```bash
$ npm install auto-rotate
```


## Basic example

```Javascript
var rotator = require('auto-rotate');

rotator.autoRotateFile('rotated.jpg', 'fixed.jpg')
.then(function(rotated) {
    console.log(rotated ? 'Image rotated' : 'No rotation was needed');
}).catch(function(err) {
    console.error('Got error: '+err);
});
```
