'use strict';

describe('auth', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/auth.js');
    expect(lib).toBeDefined;
  });

});
