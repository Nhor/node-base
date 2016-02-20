'use strict';

var fs = require('fs');
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
  logout: require('./routes/logout.js')
};

if (!fs.existsSync(__dirname + '/logs')) {
  fs.mkdirSync(__dirname + '/logs')
}

database.sync().then(function () {
  server.listen(config.port, function () {
    logger.log("Server listening on port: " + this.address().port);
  });
}).catch(function (err) {
  logger.log(err);
});
