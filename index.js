'use strict';
var fs = require("fs"),
    lwip = require('lwip'),
    exifParser = require('exif-parser'),
    fs = require('fs-extra'),
    Promise = require('bluebird');


exports.exifFromFile = function(path) {
    return new Promise(function(resolve, reject) {
        fs.open(path, 'r', function (err, fd) {
            if (err) return reject(err);

            // Read first 64K of image file (EXIF data located here)
            var headSize = 65536;
            var buffer = new Buffer(headSize);
            fs.read(fd, buffer, 0, buffer.length, null, function (err, bytesRead, buffer) {
                fs.close(fd);
                if (err) return reject(err);

                var parser = exifParser.create(buffer);
                var result = parser.parse();
                resolve(result);
            });
        });
    });
}


exports.autoRotateFile = function(source, destination) {
    return this.exifFromFile(source)
    .then(function(exif) {
        return new Promise(function(resolve, reject) {
            lwip.open(source, function(err, image) {
                if( err ) return reject(err);

                var rotatedImage = rotate(exif.tags.Orientation, image.batch());
                if( rotatedImage ) {
                    rotatedImage.writeFile(destination, function(err) {
                        if( err ) return reject(err);
                        resolve(rotatedImage);
                    });
                } else if( source !== destination ) {
                    fs.copy(source, destination, function(err) {
                        if( err ) return reject(err);
                        resolve();
                    });
                }
            });
        });
    });
}


function rotate(currentOrientation, image) {
	switch( currentOrientation ) {
	    case 1: return; // top-left  - no transform
	    case 2: return image.flip(); //	top-right - flip horizontal
	    case 3: return image.rotate(180); // bottom-right - rotate 180
	    case 4: return image.rotate(180); // bottom-left - should flip vertically, but LWIP does not support it:(
                                          // Resort to just rotating. Better than upside down.
	    case 5: return image.rotate(90).flip(); // left-top - rotate 90 and flip horizontal
	    case 6: return image.rotate(90); //	right-top - rotate 90
	    case 7: return image.rotate(270).flip(); // right-bottom - rotate 270 and flip horizontal
	    case 8: return image.rotate(270); // left-bottom - rotate 270
    };
}
