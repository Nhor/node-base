'use strict';

describe('auth chain', function () {

  var http;
  var config;
  var dashlessUuidRegex;
  var authToken;

  beforeEach(function () {
    http = require('http');
    config = require('../libs/config.js');
    dashlessUuidRegex = /^[0-9a-f]{12}[4][0-9a-f]{3}[89ab][0-9a-f]{15}$/i;
  });

  it('should not fail on POST user', function (done) {
    var postData = JSON.stringify({
      username: 'test',
      password: 'test123',
      email: 'test@test.com'
    });

    var req = http.request({
      port: config.port,
      method: 'POST',
      path: '/user',
      headers: {
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
        data = JSON.parse(data);
        expect(data.AuthToken).toMatch(dashlessUuidRegex);
        authToken = data.AuthToken;
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

  it('should not fail on logout', function (done) {
    var req = http.request({
      port: config.port,
      method: 'POST',
      path: '/logout',
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
        expect(res.statusCode).toEqual(200);
        done();
      });
    });
    req.on('error', function (err) {
      expect(err).toBeNull();
      done();
    });

    req.end();
  }, 1000);

  it('should not fail on login', function (done) {
    var postData = JSON.stringify({
      username: 'test',
      password: 'test123'
    });

    var req = http.request({
      port: config.port,
      method: 'POST',
      path: '/login',
      headers: {
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
        data = JSON.parse(data);
        expect(data.AuthToken).toMatch(dashlessUuidRegex);
        authToken = data.AuthToken;
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

  it('should not fail on DELETE user', function (done) {
    var req = http.request({
      port: config.port,
      method: 'DELETE',
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
        expect(res.statusCode).toEqual(200);
        done();
      });
    });
    req.on('error', function (err) {
      expect(err).toBeNull();
      done();
    });

    req.end();
  }, 1000);

});
