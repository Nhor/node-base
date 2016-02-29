'use strict';

var fs = require('fs');
var when = require('when');
var jimp = require('jimp');
var config = require('./libs/config.js');
var server = require('./libs/server.js');
var database = require('./libs/database.js');
var logger = require('./libs/logger.js');

var models = {
  AuthToken: require('./models/AuthToken.js'),
  User: require('./models/User.js')
};

var routes = {
  register: require('./routes/register.js'),
  unregister: require('./routes/unregister.js'),
  login: require('./routes/login.js'),
  logout: require('./routes/logout.js'),
  getProfile: require('./routes/getProfile.js'),
  editProfile: require('./routes/editProfile.js')
};

if (!fs.existsSync(__dirname + '/logs')) {
  fs.mkdirSync(__dirname + '/logs')
}

jimp.read(__dirname + '/public/users/default/avatar/avatar_base.png').then(function (avatar) {
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
    logger.log("Server listening on port: " + this.address().port);
  });
}).catch(function (err) {
  logger.log(err);
});
