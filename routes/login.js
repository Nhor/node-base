'use strict';

var bodyParser = require('body-parser');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/login', bodyParser.json(), function (req, res) {

  var validation = fields.validate(req, {
    username: fields.StringField,
    password: fields.StringField
  });
  if (validation) {
    res.status(400).send(validation);
    return;
  }

  auth.login(req.body.username, req.body.password).then(function (authToken) {
    if (!authToken) {
      res.status(401).send({error: 'Invalid username or password.'});
      return;
    }
    res.send({AuthToken: authToken.key});
  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
