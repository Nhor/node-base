'use strict';

describe('auth chain', function () {

  var http;
  var config;
  var auth;
  var dashlessUuidRegex;
  var authToken;

  beforeEach(function () {
    http = require('http');
    config = require('../libs/config.js');
    auth = require('../libs/auth.js');
    dashlessUuidRegex = /^[0-9a-f]{12}[4][0-9a-f]{3}[89ab][0-9a-f]{15}$/i;
  });

  it('sets up the test suite', function (done) {
    auth.register('test', 'test123', 'test@test.com').then(function (res) {
      authToken = res.key;
      done();
    });
  }, 1000);

  it('should not fail on PUT user', function (done) {
    var postData = JSON.stringify({
      password: 'test234',
      email: 'test2@test.com'
    });

    var req = http.request({
      port: config.port,
      method: 'PUT',
      path: '/user',
      headers: {
        'AuthToken': authToken,
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    }, function (res) {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        expect(res.statusCode).toEqual(200);
        done();
      });
    });
    req.on('error', function (err) {
      expect(err).toBeNull();
      done();
    });

    req.write(postData);
    req.end();
  }, 1000);

  it('should not fail on GET user', function (done) {
    var req = http.request({
      port: config.port,
      method: 'GET',
      path: '/user',
      headers: {
        'AuthToken': authToken
      }
    }, function (res) {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        data = JSON.parse(data);
        expect(data.body).toEqual({
          username: 'test',
          email: 'test2@test.com',
          avatar: 'public/users/default/avatar/avatar.png',
          avatarThumbnail: 'public/users/default/avatar/avatar_thumbnail.png'
        });
        done();
      });
    });
    req.on('error', function (err) {
      expect(err).toBeNull();
      done();
    });

    req.end();
  }, 1000);

  it('tears down the test suite', function (done) {
    auth.authenticate({headers: {authtoken: authToken}}).then(function (user) {
      auth.unregister(user).then(function () {
        done();
      });
    });
  }, 1000);

});
