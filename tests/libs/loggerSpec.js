'use strict';

describe('logger', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/logger.js');
    expect(lib).toBeDefined;
  });

});
