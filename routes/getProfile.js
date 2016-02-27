'use strict';

var server = require('../libs/server.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');

server.get('/get-profile', function (req, res) {

  auth.authenticate(req).then(function (user) {
    if (!user) {
      res.sendStatus(403);
      return;
    }

    profile.get(user, user.id).then(function (userInfo) {
      res.send(userInfo);
    }).catch(function (err) {
      logger.log(err);
      res.sendStatus(500);
    });

  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
