'use strict';

var fs = require('fs');
var path = require('path')
var multiparty = require('multiparty');
var ffmpeg = require('fluent-ffmpeg');
var watson = require('watson-developer-cloud');
var config = require('../libs/config.js');
var server = require('../libs/server.js');
var uuid = require('../libs/uuid.js');
var logger = require('../libs/logger.js');

server.post('/add-audio', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {
      res.sendStatus(500);
      return;
    }

    var requestFile = files[Object.keys(files)[0]][0];
    var newFilePath = __dirname + '/../public/' + uuid.v4() + '.wav';
    var supportedFormats = ['.mp4', '.mp3', '.wav', '.flac'];

    if(supportedFormats.indexOf(path.extname(requestFile.path)) < 0) {
      res.status(400).send('Supported file formats are: .mp4, .mp3, .wav and .flac.');
      return;
    }

    new ffmpeg({source: requestFile.path})
      .audioChannels(1)
      .audioFrequency(22050)
      .format('wav')
      .output(newFilePath)
      .on('end', function() {
        fs.unlink(requestFile.path);
        logger.log('Successfully converted file "' + requestFile.originalFilename + '" to WAV.');
        var result = '';
        var speechToText = watson.speech_to_text({
          username: config.watson.username,
          password: config.watson.password,
          version: 'v1'
        });
        fs.createReadStream(newFilePath)
          .pipe(speechToText.createRecognizeStream({content_type: 'audio/wav; rate=44100'}))
          .on('data', function(str) {
            result += str;
          })
          .on('end', function() {
            logger.log(result);
          })
          .on('error', function(err) {
            logger.log(err);
          });
        res.sendStatus(200);
      })
      .on('error', function(err) {
        fs.unlink(requestFile.path);
        logger.log(err);
        res.status(500).send('Could not convert file "' + requestFile.originalFilename + '" to WAV.');
      })
      .run();
  });
});
