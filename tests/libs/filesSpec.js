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
      expect(res.test).toContain('Got wrong file format');

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
      expect(res.test).toContain('Got wrong file format');

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
      expect(res.test2).toContain('Got wrong file format');

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

  it('should not fail on touch', function (done) {
    var fs = require('fs');
    var file = __dirname + '/test.txt';

    lib.touch(file).then(function () {
      expect(fs.existsSync(file)).toBeTruthy();
      fs.unlinkSync(file);
      done();
    });
  }, 1000);

  it('should not fail on read', function (done) {
    var fs = require('fs');
    var file = __dirname + '/test.txt';
    var content = 'test';

    fs.writeFileSync(file, content, {encoding: 'utf8', flag: 'a'});
    lib.read(file).then(function (res) {
      expect(res).toEqual(content);
      fs.unlinkSync(file);
      done();
    });
  }, 1000);

  it('should not fail on write', function (done) {
    var fs = require('fs');
    var file = __dirname + '/test.txt';
    var content = 'test';

    lib.write(file, content).then(function () {
      expect(fs.readFileSync(file, {encoding: 'utf8'})).toEqual(content);
      fs.unlinkSync(file);
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
