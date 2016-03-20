'use strict';

var Sequelize = require('sequelize');
var config = require('./config.js');

var database = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password, {
    dialect: 'postgres',
    host: config.database.host,
    port: config.database.port,
    logging: false,
    schema: config.database.schema
  }
);

module.exports = database;
