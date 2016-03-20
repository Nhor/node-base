'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var responder = require('../libs/responder.js');

server.delete('/user', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return responder.forbidden(res);
    }

    return auth.unregister(user).then(function () {
      return responder.success(res);
    });

  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
