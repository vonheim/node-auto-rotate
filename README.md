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
.then(function() {
    console.log("File rotated ok");
}).catch(function(err) {
    console.error("Got error: "+err);
});
```
