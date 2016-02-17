'use strict';

var fs = require('fs');

/**
 * Logs specified text to the console and to the log file.
 * @param {string} text - Text to be logged.
 */
var log = function (text) {
  var time = (new Date()).toISOString().replace(/T/g, ' ').replace(/Z/g, '');
  var logFile = __dirname + '/../logs/' + time.substr(0, 10) + '.txt';
  var logText = time + ': ' + text;
  console.log(logText);
  fs.writeFile(logFile, logText + '\n', {flag: 'a'}, function (err) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports.log = log;
