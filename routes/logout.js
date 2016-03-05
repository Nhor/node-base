'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/logout', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return res.sendStatus(403);
    }

    return auth.logout(user).then(function (logout) {
      if (!logout) {
        logger.warn(JSON.stringify({error: 'Logout failed for user with username="' + user.username + '".'}));
        return res.status(400).send({error: 'Logout failed.'});
      }
      return res.sendStatus(200);
    });

  }).catch(function (err) {
    logger.error(err);
    return res.sendStatus(500);
  });

});
