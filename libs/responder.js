'use strict';

var _ = require('lodash');

/**
 * Send successful response with status code 200 and custom body.
 * @param {object} response - HTTP response object.
 * @param {object} [body] - Response body.
 */
var success = function(response, body) {
  return response.status(200).send({
    status: 'ok',
    body: body
  });
};

/**
 * Send Bad Request response with status code 400 and custom body.
 * @param {object} response - HTTP response object.
 * @param {object} body - Response body.
 */
var badRequest = function(response, body) {
  return response.status(400).send({
    status: 'error',
    error: body
  });
};

/**
 * Send Unauthorized response with status code 401 and 'Invalid username or password.' message.
 * @param {object} response - HTTP response object.
 */
var unauthorized = function(response) {
  return response.status(401).send({
    status: 'error',
    error: 'Invalid username or password.'
  });
};

/**
 * Send Forbidden response with status code 403 and 'Forbidden.' message.
 * @param {object} response - HTTP response object.
 */
var forbidden = function(response) {
  return response.status(403).send({
    status: 'error',
    error: 'Forbidden.'
  });
};

/**
 * Send Internal Server Errpr response with status code 403 and 'Internal Server Error.' message.
 * @param {object} response - HTTP response object.
 */
var internalServerError = function(response) {
  return response.status(500).send({
    status: 'error',
    error: 'Internal server error.'
  });
};

module.exports.success = success;
module.exports.badRequest = badRequest;
module.exports.unauthorized = unauthorized;
module.exports.forbidden = forbidden;
module.exports.internalServerError = internalServerError;
