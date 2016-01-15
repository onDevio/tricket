'use strict';

var log = require('debug')('tricket:services');
var multer = require('multer');
var fs = require('fs');
var fse = require('fs-extra');

var scheduleService = require('../services/schedule-service.js')();
var config = require('../config/config')();
var finalStorage = config.finalStorage;
var uploadStorage = config.uploadStorage;
var ticketService = require('../services/ticket-service.js')();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadStorage);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage });

scheduleService.cleanUploadFolder(uploadStorage);

module.exports = function() {
  return {
    addFileToExistingTicket: addFileToExistingTicket,
    createTicketFS: createTicketFS,
    getFile: getFile,
    upload: upload
  };
};

function addFileToExistingTicket(id, file) {
  var dir = finalStorage+id;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  fse.move(uploadStorage+file, finalStorage+id+'/'+file, function (err) {
    if (err) return log(err);
    ticketService.addFileToTicket(id, file, function(){
      log("DB success!");
    });
    log("FS success!");
  });
}

function createTicketFS(ticket){
  fse.mkdirs(ticket.ticket_id, function (err) {
    if (err) return log(err);
    var dir = finalStorage+ticket.ticket_id;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
    for(var i=0;i<ticket.files.length;i++){
      fse.move(uploadStorage+ticket.files[i], dir+'/'+ticket.files[i], function (err) {
        if (err) return log(err);
        log("FS success!");
      });
    }
  });
}

function getFile(id, name, res){
   fs.readFile(finalStorage+id+'/'+name, "binary", function(err, file) {
    if(err) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write(err + "\n");
      res.end();
      return;
    }
    res.writeHead(200);
    res.write(file, 'binary');
    res.end();
  });
}
