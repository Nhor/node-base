'use strict';

var Sequelize = require('sequelize');
var database = require('../libs/database.js');

var User = database.define('user', {
  id: {
    field: 'id',
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    field: 'username',
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    field: 'password',
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    field: 'email',
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: false,
  createdAt: 'created',
  updatedAt: 'edited'
});

module.exports = User;
