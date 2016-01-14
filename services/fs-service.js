'use strict';

var log = require('debug')('tricket:services');
var multer = require('multer');
var fs = require("fs");
var fse = require('fs-extra');
var ticketService = require('../services/ticket-service.js')();
var scheduleService = require('../services/schedule-service.js')();

var finalStorage = "storage/";
var uploadStorage = "uploads/";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadStorage)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

scheduleService.cleanUploadFolder(uploadStorage);

module.exports = function() {
  return {
    addFileToExistingTicket: addFileToExistingTicket,
    upload: upload
  };
};

function addFileToExistingTicket(id, file) {
  var dir = finalStorage+id;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  fse.move(uploadStorage+file, finalStorage+id+'/'+file, function (err) {
    if (err) return console.error(err);
    ticketService.addFileToTicket(id, file, function(){
      console.log("DB success!");
    });
    console.log("FS success!");
  })
}

