'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');

server.get('/user/:id', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return res.sendStatus(403);
    }

    return profile.get(user, req.params.id || user.id).then(function (userInfo) {
      logger.info('Successfully got profile of user with username="' + userInfo.username + '" for user with username="' + user.username + '"');
      return res.send(userInfo);
    });

  }).catch(function (err) {
    logger.error(err);
    return res.sendStatus(500);
  });

});
