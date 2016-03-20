'use strict';

var bodyParser = require('body-parser');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var responder = require('../libs/responder.js');

server.post('/user', bodyParser.json(), function (req, res) {

  var validation = fields.validate(req, {
    username: fields.StringField,
    password: fields.StringField,
    email: fields.EmailField
  });
  if (validation) {
    logger.warn(JSON.stringify(validation));
    return responder.badRequest(res, validation);
  }

  return auth.register(req.body.username, req.body.password, req.body.email).then(function (authToken) {
    if (typeof authToken === 'string') {
      logger.warn(JSON.stringify({error: authToken}));
      return responder.badRequest(res, authToken);
    }
    logger.info('Successfully registered user with username="' + req.body.username + '".');
    return responder.success(res, {AuthToken: authToken.key});
  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
