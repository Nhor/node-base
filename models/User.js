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
  },
  avatar: {
    field: 'avatar',
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'public/users/default/avatar/avatar.png'
  },
  avatarThumbnail: {
    field: 'avatar_thumbnail',
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'public/users/default/avatar/avatar_thumbnail.png'
  }
}, {
  timestamps: true,
  paranoid: false,
  createdAt: 'created',
  updatedAt: 'edited'
});

module.exports = User;
