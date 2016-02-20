'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/unregister', function (req, res) {

  auth.authenticate(req).then(function (user) {
    if (!user) {
      res.sendStatus(403);
      return;
    }

    auth.unregister(user).then(function (unregister) {
      if (!unregister) {
        res.status(400).send({error: 'Could not unregister.'});
        return;
      }
      res.sendStatus(200);
    }).catch(function (err) {
      logger.log(err);
      res.sendStatus(500);
    });

  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
