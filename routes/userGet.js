'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');
var responder = require('../libs/responder.js');

server.get('/user/:id*?', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return responder.forbidden(res);
    }

    return profile.get(user, req.params.id || user.id).then(function (userInfo) {
      logger.info('Successfully got profile of user with username="' + userInfo.username + '" for user with username="' + user.username + '"');
      return responder.success(res, userInfo);
    });

  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
