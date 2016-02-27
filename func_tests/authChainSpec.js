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

  it('should not fail on register', function (done) {
    var postData = JSON.stringify({
      username: 'test',
      password: 'test',
      email: 'test@test.com'
    });

    var req = http.request({
      port: config.port,
      method: 'POST',
      path: '/register',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    }, function (res) {
      console.log(res.statusCode);
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        if(res.statusCode === 400) {
          console.log(data);
          done();
        }
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

  it('should not fail on unregister', function (done) {
    var req = http.request({
      port: config.port,
      method: 'POST',
      path: '/unregister',
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