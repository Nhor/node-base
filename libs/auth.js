'use strict';

var when = require('when');
var nodefn = require('when/node');
var bcrypt = nodefn.liftAll(require('bcrypt'));
var config = require('./config.js');
var files = require('./files.js');
var uuid = require('./uuid.js');
var AuthToken = require('../models/AuthToken.js');
var User = require('../models/User.js');

/**
 * Authenticate user by the AuthToken provided in the HTTP request header.
 * @param {object} request - HTTP request.
 */
var authenticate = function (request) {
  var queryParams = {where: {key: request.headers.authtoken}};
  return AuthToken.findOne(queryParams).then(function (authToken) {
    if (!authToken) {
      return;
    }
    if (!checkAuthTokenValidity(authToken)) {
      return authToken.destroy();
    }
    return User.findOne({
      where: {
        id: authToken.userId
      }
    }).then(function (user) {
      return user;
    });
  });
};

/**
 * Register user with provided parameters.
 * @param {string} username - Username for the user to register.
 * @param {string} password - Password for the user to register.
 * @param {string} email - Email for the user to register.
 * @return {AuthToken} Authentication token OR {string} Error message.
 */
var register = function (username, password, email) {
  var msg;
  if (!username.match(config.validators.username.regex)) {
    return when.resolve(config.validators.username.description);
  } else if (!password.match(config.validators.password.regex)) {
    return when.resolve(config.validators.password.description);
  }
  return User.findOne({
    where: {
      username: {$iLike: username}
    }
  }).then(function (user) {
    if (user) {
      return 'User with username="' + username + '" already exists.';
    }
    return User.findOne({where: {email: email.toLowerCase()}}).then(function (user) {
      if (user) {
        return 'User with email="' + email.toLowerCase() + '" already exists.';
      }
      return bcrypt.genSalt(10).then(function (salt) {
        return bcrypt.hash(password, salt);
      }).then(function (hash) {
        return User.create({
          username: username,
          password: hash,
          email: email.toLowerCase()
        });
      }).then(function (user) {
        return files.mkdir(__dirname + '/../public/users/' + user.id + '/avatar').then(function () {
          return login(user.username, password);
        });
      });
    });
  });
};

/**
 * Unregister user (in other words delete him).
 * @param {User} user - Requesting user model instance.
 * @param {boolean} True if unregister was successful.
 */
var unregister = function (user) {
  return logout(user).then(function (res) {
    if (!res) {
      return;
    }
    return user.destroy().then(function (rows) {
      return files.rm(__dirname + '/../public/users/' + user.id);
    }).then(function () {
      return true;
    });
  });
};

/**
 * Login user by username (or email) and password.
 * @param {string} username - User username (or email).
 * @param {string} password - User password.
 * @return {AuthToken} Authentication token.
 */
var login = function (username, password) {
  var queryParams = {where: {}};
  if (username.indexOf('@') > 0) {
    queryParams.where.email = username.toLowerCase();
  } else {
    queryParams.where.username = {$iLike: username};
  }
  return User.findOne(queryParams).then(function (user) {
    if (!user) {
      return;
    }
    return bcrypt.compare(password, user.password).then(function (res) {
      if (!res) {
        return;
      }
      return AuthToken.findOne({where: {userId: user.id}}).then(function (token) {
        if (token) {
          if (checkAuthTokenValidity(token)) {
            return token;
          }
          return token.destroy();
        }
        return when.resolve();
      }).then(function () {
        return AuthToken.create({
          key: uuid.v4(),
          expirationDate: new Date((new Date()).getTime() + config.authTokenExpiration * 24 * 60 * 60 * 1000),
          userId: user.id
        });
      });
    });
  });
};

/**
 * Logout user.
 * @param {User} user - Requesting user model instance.
 * @return {boolean} True if logout was successful.
 */
var logout = function (user) {
  return AuthToken.findOne({where: {userId: user.id}}).then(function (authToken) {
    if (authToken) {
      return authToken.destroy();
    }
    return when.resolve();
  }).then(function () {
    return true;
  });
};

/**
 * Check if AuthToken expiration date is still valid.
 * @param {AuthToken} authToken - AuthToken object.
 * @return {boolean} True if the AuthToken is still valid.
 */
var checkAuthTokenValidity = function (authToken) {
  return authToken.expirationDate > new Date();
};

module.exports.authenticate = authenticate;
module.exports.register = register;
module.exports.unregister = unregister;
module.exports.login = login;
module.exports.logout = logout;
