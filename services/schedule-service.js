'use strict';

var log = require('debug')('tricket:services');
var schedule = require('node-schedule');
var fs = require("fs");
var fse = require('fs-extra');

module.exports = function() {
  return {
    cleanUploadFolder: cleanUploadFolder,
  };
};

function cleanUploadFolder(uploadStorage) {
  //Clean uploaded non asigned files
  schedule.scheduleJob('*/1 * * * *', function(){
    log('Roomba module active');
    fs.readdir(uploadStorage, function(err, files) {
      var endTime,
      now = new Date().getTime();
      if (!files) {
        return;
      }
      files.forEach(function(file, index) {
        fs.stat(uploadStorage+file, function(err,stats){
           if(!err){
              endTime = new Date(stats.ctime).getTime() + 3600000;
              if (now > endTime) {
                fse.removeSync(uploadStorage+file);
                log('Removed '+ uploadStorage+file);
              }
           }
        });
      });
    });
  });
}
