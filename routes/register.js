'use strict';

var bodyParser = require('body-parser');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');

server.post('/register', bodyParser.json(), function (req, res) {

  var validation = fields.validate(req, {
    username: fields.StringField,
    password: fields.StringField,
    email: fields.EmailField
  });
  if (validation) {
    logger.log(JSON.stringify(validation));
    res.status(400).send(validation);
    return;
  }

  auth.register(req.body.username, req.body.password, req.body.email).then(function (authToken) {
    if (typeof authToken === 'string') {
      res.status(400).send(authToken);
      return;
    }
    res.send({AuthToken: authToken.key});
  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
