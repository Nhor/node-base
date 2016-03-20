'use strict';

var bodyParser = require('body-parser');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var responder = require('../libs/responder.js');

server.post('/login', bodyParser.json(), function (req, res) {

  var validation = fields.validate(req, {
    username: fields.StringField,
    password: fields.StringField
  });
  if (validation) {
    logger.warn(JSON.stringify(validation));
    return responder.badRequest(res, validation);
  }

  return auth.login(req.body.username, req.body.password).then(function (authToken) {
    if (!authToken) {
      logger.warn('Invalid username or password.');
      return responder.unauthorized(res);
    }
    logger.info('Successfully logged in user with username="' + req.body.username + '".');
    return responder.success(res, {AuthToken: authToken.key});
  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
