'use strict';

var UUID = require('pure-uuid');

/**
 * Create UUID version 4.
 * @param {boolean} [dashless] - If true, returned UUID will not contain dashes. Defaults to true.
 */
var v4 = function(dashless) {
  dashless = typeof dashless === 'undefined' ? true : dashless;
  var uuid = (new UUID(4)).format();
  if(dashless) {
    uuid = uuid.replace(/-/g, '');
  }
  return uuid;
};

/**
 * Create UUID version 5.
 * @param {string} name - Name to be hashed into the UUID.
 * @param {string} namespace - Namespace to be used in hashing. Use `namespace` values.
 * @param {boolean} [dashless] - If true, returned UUID will not contain dashes. Defaults to true.
 */
var v5 = function(name, namespace, dashless) {
  namespace = namespace || namespaceOpts.url;
  dashless = typeof dashless === 'undefined' ? true : dashless;
  var uuid = (new UUID(5, namespace, name)).format();
  if(dashless) {
    uuid = uuid.replace(/-/g, '');
  }
  return uuid;
};

/**
 * Namespace used in hashing in UUID version 5.
 */
var namespaceOpts = {
  nil: 'nil',
  dns: 'ns:DNS',
  url: 'ns:URL',
  oid: 'ns:OID',
  x500: 'ns:X500'
};

module.exports.v4 = v4;
module.exports.v5 = v5;
module.exports.namespace = namespaceOpts;
