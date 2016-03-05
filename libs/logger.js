'use strict';

var files = require('./files.js');

/**
 * Logs specified text to the console and to the log file.
 * @param {string} text - Text to be logged.
 */
var log = function (text) {
  var time = (new Date()).toISOString().replace(/T/g, ' ').replace(/Z/g, '');
  var logFile = __dirname + '/../logs/' + time.substr(0, 10) + '.txt';
  var logText = time + ': ' + text;
  console.log(logText);
  files.write(logFile, logText + '\n').catch(function (err) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports.log = log;
