'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/logout', function(req, res) {

  auth.authenticate(req).then(function(user) {
    if(!user) {
      res.sendStatus(403);
      return;
    }

    auth.logout(user).then(function(logout) {
      if(!logout) {
        res.status(400).send('Could not log out.');
        return;
      }
      res.sendStatus(200);
    }).catch(function(err) {
      logger.log(err);
      res.sendStatus(500);
    });

  }).catch(function(err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
