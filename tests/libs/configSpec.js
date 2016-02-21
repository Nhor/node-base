'use strict';

describe('config', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/config.js');
    expect(lib).toBeDefined();
  });

});
