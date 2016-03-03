'use strict';

var fs = require('fs');
var _ = require('lodash');
var when = require('when');
var nodefn = require('when/node');
var parallel = require('when/parallel');
var readChunk = nodefn.lift(require('read-chunk'));
var fileType = require('file-type');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

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
    _.map(files, function (expectedFileType, fileName) {
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
  return readChunk(filePath, 0, 262).then(function (buffer) {
    if (!fileType(buffer) || fileType(buffer).ext !== expectedFileType) {
      return 'Got wrong file format, expected ' + expectedFileType.toUpperCase() + '.';
    }
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

/**
 * Create specified directory.
 * @param {string} path - Path of the directory to create.
 */
var mkdir = function(path) {
  return nodefn.lift(mkdirp)(path, {});
};

/**
 * Rename file or move it to specified location.
 * @param {string} currentFilePath - Current path of the file.
 * @param {string} newFilePath - New path for the file.
 */
var mv = function(currentFilePath, newFilePath) {
  return nodefn.lift(fs.rename)(currentFilePath, newFilePath);
};

/**
 * Remove specified file or directory.
 * @param {string} path - Path of the file or directory.
 */
var rm = function(path) {
  return nodefn.lift(rimraf)(path, {});
};

module.exports.validate = validate;
module.exports.JpgFile = JpgFile;
module.exports.PngFile = PngFile;
module.exports.BmpFile = BmpFile;
module.exports.ImageFile = ImageFile;
module.exports.optional = optional;
module.exports.mkdir = mkdir;
module.exports.mv = mv;
module.exports.rm = rm;
