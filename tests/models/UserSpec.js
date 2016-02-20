'use strict';

describe('User', function () {

  it('should not fail on require', function () {
    var lib = require('../../models/User.js');
    expect(lib).toBeDefined;
  });

});
