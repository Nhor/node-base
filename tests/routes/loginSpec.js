'use strict';

describe('login', function () {

  it('should not fail on require', function () {
    var lib = require('../../routes/login.js');
    expect(lib).toBeDefined;
  });

});
