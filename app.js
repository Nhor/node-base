'use strict';

var fs = require('fs');
var when = require('when');
var jimp = require('jimp');
var config = require('./libs/config.js');
var files = require('./libs/files.js');
var server = require('./libs/server.js');
var database = require('./libs/database.js');
var logger = require('./libs/logger.js');

var models = {
  AuthToken: require('./models/AuthToken.js'),
  User: require('./models/User.js')
};

var routes = {
  login: require('./routes/login.js'),
  logout: require('./routes/logout.js'),
  userGet: require('./routes/userGet.js'),
  userPost: require('./routes/userPost.js'),
  userPut: require('./routes/userPut.js'),
  userDelete: require('./routes/userDelete.js')
};

files.mkdir(__dirname + '/logs').then(function () {
  return jimp.read(__dirname + '/public/users/default/avatar/avatar_base.png');
}).then(function (avatar) {
  return when.all([
    avatar
      .resize(config.userAvatarImage.size.width, config.userAvatarImage.size.height)
      .write(__dirname + '/public/users/default/avatar/avatar.png'),
    avatar
      .resize(config.userAvatarImage.thumbnailSize.width, config.userAvatarImage.thumbnailSize.height)
      .write(__dirname + '/public/users/default/avatar/avatar_thumbnail.png')
  ]);
}).then(function () {
  return database.sync();
}).then(function () {
  server.listen(config.port, function () {
    logger.info('Server listening on port: ' + this.address().port);
  });
}).catch(function (err) {
  logger.error(err);
});
