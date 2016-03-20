'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var responder = require('../libs/responder.js');

server.post('/logout', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return responder.forbidden(res);
    }

    return auth.logout(user).then(function () {
      logger.info('Successfully logged out user with username="' + user.username + '".');
      return responder.success(res, 'Successfully logged out.');
    });

  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
