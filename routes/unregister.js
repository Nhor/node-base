'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/unregister', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      logger.warn('Authentication failed for AuthToken with key="' + req.headers.authtoken + '".');
      return res.sendStatus(403);
    }

    return auth.unregister(user).then(function (unregister) {
      if (!unregister) {
        logger.warn(JSON.stringify({error: 'Unregistration failed for user with username="' + user.username + '".'}));
        return res.status(400).send({error: 'Unregistration failed.'});
      }
      return res.sendStatus(200);
    });

  }).catch(function (err) {
    logger.error(err);
    return res.sendStatus(500);
  });

});
