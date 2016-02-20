'use strict';

var Sequelize = require('sequelize');
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
  },
  userId: {
    field: 'user_id',
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  timestamps: true,
  paranoid: false,
  createdAt: 'created',
  updatedAt: false
});

module.exports = AuthToken;
