'use strict';

var express = require('express');
var cors = require('cors');
var logger = require('./logger.js');

var server = express();

server.enable('trust proxy');

server.use(cors());

server.use(function (req, res, next) {
  logger.info(req.method + ' ' + req.path + ' request received from ' + req.ip +
    '. ' + 'Request headers: ' + JSON.stringify(req.headers) + '.');
  next();
});

module.exports = server;
