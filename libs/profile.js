'use strict';

var when = require('when');
var nodefn = require('when/node');
var bcrypt = nodefn.liftAll(require('bcrypt'));
var config = require('../libs/config.js');
var logger = require('../libs/logger.js');
var User = require('../models/User.js');

/**
 * Get user profile information.
 * @param {User} requestingUser - User requesting for other user information.
 * @param {number} requestedUserId - Id of requested user.
 * @return {object} Dict containing requested user information.
 */
var get = function (requestingUser, requestedUserId) {
  if (requestingUser.id === requestedUserId) {
    return when.resolve({
      username: requestingUser.username,
      email: requestingUser.email,
      avatar: requestingUser.avatar,
      avatarThumbnail: requestingUser.avatarThumbnail
    });
  }
  return User.findOne({where: {id: requestedUserId}}).then(function (requestedUser) {
    return {
      username: requestedUser.username,
      avatar: requestedUser.avatar,
      avatarThumbnail: requestedUser.avatarThumbnail
    };
  });
};

/**
 * Check if the specified password can be changed for a specific user.
 * @param {object} args - Dict containing `password` with:
 *   {User} user - User for whom the password will be changed.
 *   {string} password - New password.
 */
var checkPassword = function (args) {
  var password = args.password.password;
  if (!password.match(config.validators.password.regex)) {
    var msg = config.validators.password.description;
    logger.log(msg);
    return when.resolve(msg);
  }
  return when.resolve();
};

/**
 * Change password for a specific user.
 * @param {object} args - Dict containing `password` with:
 *   {User} user - User for whom the password will be changed.
 *   {string} password - New password.
 */
var changePassword = function (args) {
  var user = args.password.user;
  var password = args.password.password;
  return bcrypt.genSalt(10).then(function (salt) {
    return bcrypt.hash(password, salt);
  }).then(function (hash) {
    return user.update({password: hash});
  }).then(function (user) {
    logger.log('Successfully changed password for user with username="' + user.username + '".');
  });
};

/**
 * Check if the specified email can be changed for a specific user.
 * @param {object} args - Dict containing `email` with:
 *   {User} user - User for whom the password will be changed.
 *   {string} email - New email.
 */
var checkEmail = function (args) {
  var email = args.email.email.toLowerCase();
  return User.findOne({
    where: {
      email: email
    }
  }).then(function (foundUser) {
    if (foundUser) {
      logger.log('User with email="' + email + '" already exist.');
      return 'This email is already in use.';
    }
  });
};

/**
 * Check if the specified email can be changed for a specific user.
 * @param {object} args - Dict containing `email` with:
 *   {User} user - User for whom the password will be changed.
 *   {string} email - New email.
 */
var changeEmail = function (args) {
  var user = args.email.user;
  var email = args.email.email.toLowerCase();
  return user.update({email: email}).then(function (user) {
    logger.log('Successfully changed email for user with username="' + user.username + '".');
  });
};

module.exports.get = get;
module.exports.checkPassword = checkPassword;
module.exports.changePassword = changePassword;
module.exports.checkEmail = checkEmail;
module.exports.changeEmail = changeEmail;
