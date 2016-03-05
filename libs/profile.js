'use strict';

var when = require('when');
var nodefn = require('when/node');
var bcrypt = nodefn.liftAll(require('bcrypt'));
var jimp = require('jimp');
var config = require('../libs/config.js');
var files = require('../libs/files.js');
var uuid = require('../libs/uuid.js');
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
    return when.resolve(config.validators.password.description);
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
  });
};

/**
 * Check if the specified email can be changed for a specific user.
 * @param {object} args - Dict containing `email` with:
 *   {User} user - User for whom the email will be changed.
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
      return 'This email is already in use.';
    }
  });
};

/**
 * Change email for a specific user.
 * @param {object} args - Dict containing `email` with:
 *   {User} user - User for whom the email will be changed.
 *   {string} email - New email.
 */
var changeEmail = function (args) {
  var user = args.email.user;
  var email = args.email.email.toLowerCase();
  return user.update({email: email});
};

/**
 * Check if the specified avatar can be changed for a specific user.
 * @param {object} args - Dict containing `avatar` with:
 *   {User} user - User for whom the avatar will be changed.
 *   {string} avatar - New avatar path.
 */
var checkAvatar = function (args) {
  var avatar = args.avatar.avatar;
  if (!avatar) {
    return when.reject();
  }
  return when.resolve();
};

/**
 * Change avatar for a specific user.
 * @param {object} args - Dict containing `avatar` with:
 *   {User} user - User for whom the avatar will be changed.
 *   {string} avatar - New avatar path.
 */
var changeAvatar = function (args) {
  var user = args.avatar.user;
  var avatar = args.avatar.avatar;

  var fileName = uuid.v4();
  var avatarPath = 'public/users/' + user.id + '/avatar/' + fileName + '.png';
  var avatarThumbnailPath = 'public/users/' + user.id + '/avatar/' + fileName + '_thumbnail.png';

  return jimp.read(avatar.path).then(function (avatar) {
    return when.all([
      avatar
        .resize(config.userAvatarImage.size.width, config.userAvatarImage.size.height)
        .write(__dirname + '/../' + avatarPath),
      avatar
        .resize(config.userAvatarImage.thumbnailSize.width, config.userAvatarImage.thumbnailSize.height)
        .write(__dirname + '/../' + avatarThumbnailPath)
    ]);
  }).then(function () {
    files.rm(avatar.path);
    return user.update({avatar: avatarPath, avatarThumbnail: avatarThumbnailPath});
  });
};

module.exports.get = get;
module.exports.checkPassword = checkPassword;
module.exports.changePassword = changePassword;
module.exports.checkEmail = checkEmail;
module.exports.changeEmail = changeEmail;
module.exports.checkAvatar = checkAvatar;
module.exports.changeAvatar = changeAvatar;
