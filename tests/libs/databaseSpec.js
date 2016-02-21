'use strict';

describe('database', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/database.js');
    expect(lib).toBeDefined();
  });

});
