'use strict';

describe('uuid', function () {

  it('should not fail on require', function () {
    var lib = require('../../libs/uuid.js');
    expect(lib).toBeDefined();
  });

});
