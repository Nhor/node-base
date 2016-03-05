'use strict';

var files = require('./files.js');

/**
 * Logs specified text to the console and to the log file.
 * @param {string} text - Text to be logged.
 */
var info = function (text) {
  return print('[INFO] ' + text, console.info);
};

/**
 * Logs specified warning to the console and to the log file.
 * @param {string} text - Text to be logged.
 */
var warn = function (text) {
  return print('[WARN] ' + text, console.warn);
};

/**
 * Logs specified error to the console and to the log file.
 * @param {string} text - Text to be logged.
 */
var error = function (text) {
  return print('[ERROR] ' + text, console.error);
};

/**
 * Logs specified text to the console and to the log file.
 * @param {string} text - Text to be logged.
 * @param {function} func - Function used for logging.
 */
var print = function (text, func) {
  var time = (new Date()).toISOString().replace(/T/g, ' ').replace(/Z/g, '');
  var logFile = __dirname + '/../logs/' + time.substr(0, 10) + '.txt';
  var logText = time + ': ' + text;
  func(logText);
  return files.write(logFile, logText + '\n').catch(function (err) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
