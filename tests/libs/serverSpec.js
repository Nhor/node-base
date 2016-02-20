'use strict';

describe('server', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/server.js');
    expect(lib).toBeDefined;
  });

});
