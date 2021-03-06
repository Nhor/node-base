'use strict';

var _ = require('lodash');
var when = require('when');
var nodefn = require('when/node');
var parallel = require('when/parallel');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var server = require('../libs/server.js');
var fields = require('../libs/fields.js');
var files = require('../libs/files.js');
var auth = require('../libs/auth.js');
var logger = require('../libs/logger.js');
var profile = require('../libs/profile.js');
var responder = require('../libs/responder.js');

server.put('/user', function (req, res) {

  return auth.authenticate(req).then(function (user) {
    if (!user) {
      return responder.forbidden(res);
    }

    return (function () {
      if (req.headers['content-type'] === 'application/json') {
        return nodefn.lift(bodyParser.json())(req, res).then(function () {
          req.files = {};
        });
      }
      var form = new multiparty.Form();
      return when.promise(function (resolve, reject) {
        form.parse(req, function (err, reqFields, reqFiles) {
          if (err) {
            return reject(err);
          }
          req.body = _.mapValues(reqFields, _.first);
          req.files = _.mapValues(reqFiles, _.first);
          return resolve();
        });
      });
    })().then(function () {

      var validation = fields.validate(req, {
        password: fields.optional(fields.StringField),
        email: fields.optional(fields.EmailField)
      });
      if (validation) {
        logger.warn(JSON.stringify(validation));
        return responder.badRequest(res, validation);
      }
      return files.validate(req, {
        avatar: files.optional(files.ImageFile)
      }).then(function (validation) {
        if (validation) {
          _.map(validation.error, function (file) {
            return files.rm(file.path);
          });
          logger.warn(JSON.stringify(validation));
          return responder.badRequest(res, validation);
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
        ).then(function (descriptors) {
          if (_.some(descriptors, _.isString)) {
            var error = descriptors.reduce(function (result, elem, index) {
              var obj = {};
              obj[_.keys(changes)[index]] = elem;
              return _.mergeWith(result, obj);
            }, {});
            logger.warn(JSON.stringify(error));
            return responder.badRequest(res, error);
          }
          return parallel(
            _.map(changes, 'change'),
            _.mapValues(changes, 'args')
          ).then(function (descriptors) {
            logger.info('Successfully changed ' + _.keys(changes).join(', ') + ' for user with username="' + user.username + '".');
            return responder.success(res);
          });
        });

      });

    });

  }).catch(function (err) {
    logger.error(err);
    return responder.internalServerError(res);
  });

});
