'use strict';

var _ = require('lodash');
var parallel = require('when/parallel');
var multiparty = require('multiparty');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var files = require('../libs/files.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');

server.put('/edit-profile', function (req, res) {

  auth.authenticate(req).then(function (user) {
    if (!user) {
      res.sendStatus(403);
      return;
    }

    var form = new multiparty.Form();
    form.parse(req, function (err, reqFields, reqFiles) {
      if (err) {
        logger.log(err);
        res.sendStatus(500);
        return;
      }

      req.body = _.mapValues(reqFields, _.first);
      req.files = _.mapValues(reqFiles, _.first);

      var validation = fields.validate(req, {
        password: fields.optional(fields.StringField),
        email: fields.optional(fields.EmailField)
      });
      if (validation) {
        res.status(400).send(validation);
        return;
      }

      files.validate(req, {
        avatar: files.optional(files.ImageFile)
      }).then(function (validation) {
        if (validation) {
          _.map(validation.error, function (file) {
            files.rm(file.path);
          });
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
        if (req.files.avatar) {
          changes.avatar = {
            check: profile.checkAvatar,
            change: profile.changeAvatar,
            args: {user: user, avatar: req.files.avatar}
          };
        }

        return parallel(
          _.map(changes, 'check'),
          _.mapValues(changes, 'args')
        );
      }).then(function (descriptors) {
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

    });

  }).catch(function (err) {
    logger.log(err);
    res.sendStatus(500);
  });

});
