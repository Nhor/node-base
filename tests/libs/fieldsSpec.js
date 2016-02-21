'use strict';

describe('fields', function () {

  var lib;

  beforeEach(function () {
    lib = require('../../libs/fields.js');
  });

  it('should not fail on require', function () {
    expect(lib).toBeDefined();
  });

  it('should not fail on StringField validation', function () {
    var req = {body: {test: 'test'}};
    expect(lib.validate(req, {
      test: lib.StringField
    })).not.toBeDefined();

    req.body.test = ['test1', 'test2'];
    expect(lib.validate(req, {
      test: lib.StringField
    }).error.test).toContain('Got wrong field format');
  });

  it('should not fail on StringArrayField validation', function () {
    var req = {body: {test: ['test1', 'test2']}};
    expect(lib.validate(req, {
      test: lib.StringArrayField
    })).not.toBeDefined();

    req.body.test = 123;
    expect(lib.validate(req, {
      test: lib.StringArrayField
    }).error.test).toContain('Got wrong field format');
  });

  it('should not fail on IntegerField validation', function () {
    var req = {body: {test: 123}};
    expect(lib.validate(req, {
      test: lib.IntegerField
    })).not.toBeDefined();

    req.body.test = 123.456;
    expect(lib.validate(req, {
      test: lib.IntegerField
    }).error.test).toContain('Got wrong field format');
  });

  it('should not fail on FloatField validation', function () {
    var req = {body: {test: 123.456}};
    expect(lib.validate(req, {
      test: lib.FloatField
    })).not.toBeDefined();

    req.body.test = 'test@test.com';
    expect(lib.validate(req, {
      test: lib.FloatField
    }).error.test).toContain('Got wrong field format');
  });

  it('should not fail on EmailField validation', function () {
    var req = {body: {test: 'test@test.com'}};
    expect(lib.validate(req, {
      test: lib.EmailField
    })).not.toBeDefined();

    req.body.test = 'test';
    expect(lib.validate(req, {
      test: lib.EmailField
    }).error.test).toContain('Got wrong field format');
  });

  it('should not fail on optional values validation', function () {
    var req = {body: {test: 'test'}};
    expect(lib.validate(req, {
      test: lib.StringField,
      test2: lib.optional(lib.StringField)
    })).not.toBeDefined();

    req.body.test2 = 123;
    expect(lib.validate(req, {
      test: lib.StringField,
      test2: lib.optional(lib.StringField)
    }).error.test).not.toBeDefined();
    expect(lib.validate(req, {
      test: lib.StringField,
      test2: lib.optional(lib.StringField)
    }).error.test2).toContain('Got wrong field format');
  });

});
