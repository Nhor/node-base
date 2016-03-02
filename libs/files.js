'use strict';

var _ = require('lodash');
var when = require('when');
var parallel = require('when/parallel');
var readChunk = require('read-chunk');
var fileType = require('file-type');

/**
 * Validate specified files for the correct formats.
 * @param {object} request - HTTP request with files to validate.
 * @param {object} files - Dict with a file name as key and a pattern as value.
 * @return {undefined} If the validation succeeded - nothing (undefined) OR
 *         {object} If the validation failed - dict containing error messages for incorrect files.
 * @example
 * >>> files.validate(req, {
 *       avatar: files.ImageFile,
 *     }).then(function(res) {});
 * {}
 * @example
 * >>> files.validate(req, {
 *       avatar: files.ImageFile,
 *       audio: files.BmpFile,
 *     }).then(function(res) {});
 * {error: {audio: 'Got wrong file format, expected BMP.'}}
 */
var validate = function (request, files) {
  if (_.isEmpty(files)) {
    return when.resolve();
  }

  var error = {};
  return when.promise(function (resolve, reject) {
    _.map(files, function (fileName, expectedFileType) {
      return function () {
        if (_.isArray(expectedFileType) && expectedFileType[1] === 'optional') {
          return request.files[fileName] ?
            expectedFileType[0](request.files[fileName].path) : when.resolve();
        }
        return expectedFileType(request.files[fileName].path);
      }().then(function (res) {
        if (res) {
          var obj = {};
          obj[fileName] = res;
          error = _.mergeWith(error, obj);
        }
        _.unset(files, fileName);
        if (_.isEmpty(files)) {
          return resolve(_.isEmpty(_.pickBy(error)) ? undefined : {error: _.pickBy(error)});
        }
      }).catch(function (err) {
        return reject(err);
      });
    });
  });
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
    if (_.every(descriptors, _.isString)) {
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
      if (!fileType(buffer) || fileType(buffer).ext !== expectedFileType) {
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

module.exports.validate = validate;
module.exports.JpgFile = JpgFile;
module.exports.PngFile = PngFile;
module.exports.BmpFile = BmpFile;
module.exports.ImageFile = ImageFile;
module.exports.optional = optional;
