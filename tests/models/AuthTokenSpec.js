'use strict';

describe('AuthToken', function () {

  it('should not fail on require', function () {
    var lib = require('../../models/AuthToken.js');
    expect(lib).toBeDefined;
  });

});
