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

});
