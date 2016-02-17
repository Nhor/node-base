'use strict';

var express = require('express');
var logger = require('./logger.js');

var server = express();

server.enable('trust proxy');

server.use(function (req, res, next) {
  logger.log(req.path + ' request received from ' + req.ip + '. ' +
    'Request headers: ' + JSON.stringify(req.headers) + '.');
  next();
});

module.exports = server;
