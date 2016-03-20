'use strict';

var Sequelize = require('sequelize');
var config = require('../libs/config.js');
var database = require('../libs/database.js');
var User = require('./User.js');

var AuthToken = database.define('auth_token', {
  id: {
    field: 'id',
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  key: {
    field: 'key',
    type: Sequelize.STRING,
    allowNull: false
  },
  expirationDate: {
    field: 'expiration_date',
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: false,
  createdAt: 'created',
  updatedAt: false
});
AuthToken.schema(config.database.schema);

AuthToken.belongsTo(User, {foreignKey: 'user_id'});

module.exports = AuthToken;
