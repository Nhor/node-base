'use strict';

describe('files', function () {

  var lib;

  beforeEach(function () {
    lib = require('../../libs/files.js');
  });

  it('should not fail on require', function () {
    expect(lib).toBeDefined();
  });

  it('should not fail on PngFile validation', function (done) {
    var req = {
      files: {
        test: {path: __dirname + '/../../public/users/default/avatar/avatar_base.png'}
      }
    };

    lib.validate(req, {
      test: lib.PngFile
    }).then(function (res) {
      expect(res).not.toBeDefined();

      req.files.test.path = __dirname + '/../../app.js';
      return lib.validate(req, {
        test: lib.PngFile
      });
    }).then(function (res) {
      expect(res.error.test).toContain('Got wrong file format');

      done();
    });
  }, 1000);

  it('should not fail on ImageFile validation', function (done) {
    var req = {
      files: {
        test: {path: __dirname + '/../../public/users/default/avatar/avatar_base.png'}
      }
    };

    lib.validate(req, {
      test: lib.ImageFile
    }).then(function (res) {
      expect(res).not.toBeDefined();

      req.files.test.path = __dirname + '/../../app.js';
      return lib.validate(req, {
        test: lib.ImageFile
      });
    }).then(function (res) {
      expect(res.error.test).toContain('Got wrong file format');

      done();
    });
  }, 1000);

  it('should not fail on optional values validation', function (done) {
    var req = {
      files: {
        test: {path: __dirname + '/../../public/users/default/avatar/avatar_base.png'}
      }
    };

    lib.validate(req, {
      test: lib.ImageFile,
      test2: lib.optional(lib.PngFile)
    }).then(function (res) {
      expect(res).not.toBeDefined();

      req.files.test2 = {path: __dirname + '/../../public/users/default/avatar/avatar_base.png'};
      return lib.validate(req, {
        test: lib.ImageFile,
        test2: lib.PngFile
      });
    }).then(function (res) {
      expect(res).not.toBeDefined();

      req.files.test2.path = __dirname + '/../../app.js';
      return lib.validate(req, {
        test: lib.ImageFile,
        test2: lib.PngFile
      });
    }).then(function (res) {
      expect(res.error.test2).toContain('Got wrong file format');

      done();
    });
  }, 1000);

  it('should not fail on mkdir', function (done) {
    var fs = require('fs');
    var dir = __dirname + '/test/test2';

    lib.mkdir(dir).then(function () {
      expect(fs.existsSync(dir)).toBeTruthy();
      fs.rmdirSync(dir);
      fs.rmdirSync(__dirname + '/test');
      done();
    });
  }, 1000);

  it('should not fail on mv', function (done) {
    var fs = require('fs');
    var oldPath = __dirname + '/test.txt';
    var newPath = __dirname + '/../test.txt';

    fs.openSync(oldPath, 'w');
    lib.mv(oldPath, newPath).then(function () {
      expect(fs.existsSync(newPath)).toBeTruthy();
      fs.unlinkSync(newPath);
      done();
    });
  }, 1000);

  it('should not fail on rm', function (done) {
    var fs = require('fs');
    var dir = __dirname + '/test';
    var file = dir + '/test.txt';

    fs.mkdirSync(dir);
    fs.openSync(file, 'w');
    lib.rm(dir).then(function () {
      expect(fs.existsSync(dir)).toBeFalsy();
      done();
    });
  }, 1000);

});
