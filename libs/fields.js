'use strict';

var logger = require('./logger.js');

/**
 * Validate specified fields for the correct formats.
 * @param {object} request - HTTP request with fields to validate.
 * @param {object} fields - Dict with a field name as key and a pattern as value.
 * @return {undefined} If the validation succeeded - nothing (undefined) OR
 *         {object} If the validation failed - dict containing error messages for incorrect fields.
 * @example
 * >>> fields.validate(req, {
 *       username: fields.StringField,
 *       email: fields.EmailField
 *     });
 * {}
 * @example
 * >>> fields.validate(req, {
 *       username: fields.StringField,
 *       email: fields.IntegerField
 *     });
 * {username: 'Got wrong field format, expected an integer.'}
 */
var validate = function (request, fields) {
  var result = {};
  var keys = Object.keys(fields);
  var temp;
  for (var i = 0; i < keys.length; i++) {
    temp = fields[keys[i]](request.body[keys[i]]);
    if (temp) {
      result[keys[i]] = temp;
    }
  }
  if (Object.keys(result).length) {
    logger.log(JSON.stringify(result));
    return result;
  }
};

var StringField = function (value) {
  if (typeof value !== 'string') {
    return 'Got wrong field format, expected a string.';
  }
};

var StringArrayField = function (value) {
  if (!(value instanceof Array)) {
    return 'Got wrong field format, expected an array of strings.';
  }
  for (var i = 0; i < value.length; i++) {
    if (typeof value[i] !== 'string') {
      return 'Got wrong field format, expected an array of strings.';
    }
  }
};

var IntegerField = function (value) {
  if (typeof value !== 'number' || value !== parseInt(value)) {
    return 'Got wrong field format, expected an integer.';
  }
};

var FloatField = function (value) {
  if (typeof value !== 'number' || value !== parseFloat(value)) {
    return 'Got wrong field format, expected a float.';
  }
};

var EmailField = function (value) {
  var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return 'Got wrong field format, expected a string with an email.';
  }
};

module.exports.validate = validate;
module.exports.StringField = StringField;
module.exports.StringArrayField = StringArrayField;
module.exports.IntegerField = IntegerField;
module.exports.FloatField = FloatField;
module.exports.EmailField = EmailField;
