'use strict';

var _ = require('lodash');
var parallel = require('when/parallel');
var bodyParser = require('body-parser');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');

server.put('/edit-profile', bodyParser.json(), function (req, res) {

  auth.authenticate(req).then(function (user) {
    if (!user) {
      res.sendStatus(403);
      return;
    }

    var validation = fields.validate(req, {
      password: fields.optional(fields.StringField),
      email: fields.optional(fields.EmailField)
    });
    if (validation) {
      res.status(400).send(validation);
      return;
    }

    var changes = {};
    if (req.body.password) {
      changes.password = {
        check: profile.checkPassword,
        change: profile.changePassword,
        args: {user: user, password: req.body.password}
      };
    }
    if (req.body.email) {
      changes.email = {
        check: profile.checkEmail,
        change: profile.changeEmail,
        args: {user: user, email: req.body.email}
      };
    }

    parallel(
      _.map(changes, 'check'),
      _.mapValues(changes, 'args')
    ).then(function (descriptors) {
      if (_.some(descriptors, _.isString)) {
        var error = descriptors.reduce(function (result, elem, index) {
          var obj = {};
          obj[_.keys(changes)[index]] = elem;
          return _.mergeWith(result, obj);
        }, {});
        logger.log(JSON.stringify(error));
        res.status(400).send({error: error});
        return;
      }

      parallel(
        _.map(changes, 'change'),
        _.mapValues(changes, 'args')
      ).then(function (descriptors) {
        res.sendStatus(200);
      }).catch(function (err) {
        logger.log(err);
        res.sendStatus(500);
      });

    }).catch(function (err) {
      logger.log(err);
      res.sendStatus(500);
    });

  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
