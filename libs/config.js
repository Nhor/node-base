'use strict';

/**
 * Required config for the application to run properly:
 * @param {number} port - Port number for application to run on.
 * @param {object} database - Dict containing PostgreSQL database information:
 *   {string} name - Database name.
 *   {string} host - Database host address.
 *   {number} port - Database port number.
 *   {string} user - Database user username.
 *   {string} password - Database user password.
 * @param {object} validators - Dict containing validators:
 *   {object} username - Validators for username:
 *     {string} description - Description of the username validator.
 *     {RegExp} regex - Regular expression for the username validator.
 *   {object} password - Validators for password:
 *     {string} description - Description of the password validator.
 *     {RegExp} regex - Regular expression for the password validator.
 * @param {number} authTokenExpiration - Number of days after which AuthToken expires.
 */
var config = {
  port: 8000,
  database: {
    name: '',
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: ''
  },
  validators: {
    username: {
      description: 'Username must be from 2 to 16 alphanumeric characters including at least one letter.',
      regex: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,16}$/
    },
    password: {
      description: 'Password must be from 6 to 32 alphanumeric and special characters including at least one letter and number.',
      regex: /^(?=.*[a-zA-Z])(?=.*[1-9])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{6,32}$/
    }
  },
  authTokenExpiration: 14
};

module.exports = config;
