'use strict';

var when = require('when');
var parallel = require('when/parallel');
var readChunk = require('read-chunk');
var fileType = require('file-type');

var validate = function (request, files) {
};

var JpgFile = function (filePath) {
  return checkFileType(filePath, 'jpg');
};

var PngFile = function (filePath) {
  return checkFileType(filePath, 'png');
};

var BmpFile = function (filePath) {
  return checkFileType(filePath, 'bmp');
};

var ImageFile = function (filePath) {
  return parallel([JpgFile, PngFile, BmpFile], filePath).then(function (descriptors) {
    if (_.some(descriptors, _.isString)) {
      return 'Got wrong file format, expected JPG/PNG/BMP.';
    }
  });
};

var checkFileType = function (filePath, expectedFileType) {
  return when.promise(function (resolve, reject) {
    readChunk(filePath, 0, 262, function (err, buffer) {
      if (err) {
        return reject(err);
      }
      if (fileType(buffer).ext === expectedFileType) {
        return resolve('Got wrong file format, expected ' + expectedFileType.toUpperCase() + '.');
      }
      return resolve();
    });
  });
};

/**
 * Mark file as optional.
 * @param {function} expectedFileType - Expected type of the file.
 * @return {array} Array containing `expectedFileType` and 'optional' flag.
 */
var optional = function (expectedFileType) {
  return [expectedFileType, 'optional'];
};

modlue.exports.validate = validate;
module.exports.JpgFile = JpgFile;
module.exports.PngFile = PngFile;
module.exports.BmpFile = BmpFile;
module.exports.ImageFile = ImageFile;
module.exports.optional = optional;
