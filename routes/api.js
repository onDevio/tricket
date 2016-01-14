'use strict';
var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require("fs");
var fse = require('fs-extra')
var finalStorage = "storage/";
var uploadStorage = "uploads/";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadStorage)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })
var log = require('debug')('tricket:api');

var ticketService = require('../services/ticket-service.js')();
var mailService = require('../services/mail-service.js')();
var counterService = require('../services/counter-service.js')();

var schedule = require('node-schedule');


//Clean uploaded non asigned files
schedule.scheduleJob('*/5 * * * *', function(){
  console.log('Roomba module active');
  fs.readdir(uploadStorage, function(err, files) {
    var endTime, 
    now = new Date().getTime();
    files.forEach(function(file, index) {
      fs.stat(uploadStorage+file, function(err,stats){
         if(!err){     
            endTime = new Date(stats.ctime).getTime() + 3600000;
            if (now > endTime) {     
              fse.removeSync(uploadStorage+file);
              console.log('Removed '+ uploadStorage+file);  
            }
         }
      })  
    });
  });  
});

router.post( '/file-upload', upload.any(), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file
  log('req.files: ' + JSON.stringify(req.files, null, 2));
  return res.status( 200 ).send( req.files );
});

router.post( '/file-upload/:id', upload.any(), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file
  log('req.files: ' + JSON.stringify(req.files, null, 2));
  var dir = finalStorage+req.params.id;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  fse.move(req.files[0].path, finalStorage+req.params.id+'/'+req.files[0].filename, function (err) {
    if (err) return console.error(err);
    ticketService.addFileToTicket(req.params.id, req.files[0].filename, function(){
      console.log("DB success!");
    });
    console.log("FS success!");
  })
  return res.status( 200 ).send( req.files );
});

router.get('/file/:id/:name', function(req, res) {
  var id = req.params.id;
  var name = req.params.name;

  fs.readFile(finalStorage+id+'/'+name, "binary", function(err, file) {
    if(err) {        
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write(err + "\n");
      res.end();
      return;
    }

    res.writeHead(200);
    res.write(file, "binary");
    res.end();
  });
});


router.post('/ticket/new', function(req, res) {
  //log(req.body);
  var date = new Date();
  var note = {
    'body': req.body.body,
    'type': 'external',
    'dateCreated': date.toISOString(),
    'worklog': req.body.worklog || 0,
    'user' : req.user.displayName
  };
  var files = req.body.files.split(',');
  var ticket = {
    customer: {
      email: req.body.customer,
      name: ''
    },
    asignee: 'Not asigned',
    status: req.body.close !== undefined ? 'Closed' : 'Open',
    title: req.body.title || '<Empty subject>',
    dateCreated: new Date().toISOString(),
    notes: [note],
    files: files
  };
  ticketService.insertTicket(ticket, function(result) {
    //Move files into final folder   
    createTicketFS(result); 
    log('Inserted ticket to mongo');
    res.redirect(302, '/app/tickets');
  });
});

function createTicketFS(ticket){
  fse.mkdirs(ticket.ticket_id, function (err) {
    if (err) return console.error(err);
    for(var i=0;i<ticket.files.length;i++){
      fse.move(uploadStorage+ticket.files[i], finalStorage+ticket.ticket_id+'/'+ticket.files[i], function (err) {
        if (err) return console.error(err);
        console.log("success!")
      })
    }
  })
}

router.get('/ticket/:id/asign/:user', function(req, res) {
  var id = req.params.id;
  var user = req.params.user;

  ticketService.asignTicket(id, user, function(result) {
    log('Ticket claimed');
  });
  res.redirect(302, '/app/ticket/'+id);
});

router.get('/ticket/:id/reject', function(req, res) {
  var id = req.params.id;
  //TODO: if external, send mail to customer
  ticketService.rejectTicket(id, function(result) {
    log('Ticket rejected');
  });
  res.redirect(302, '/app/ticket/'+id);
});


router.post('/ticket/:id/note', function(req, res) {
  var id = req.params.id;
  var date = new Date();
  var note = {
    'body': req.body.body,
    'type': req.body.type,
    'dateCreated': date.toISOString(),
    'worklog': req.body.worklog || 0,
    'user' : req.user.displayName
  };

  //console.log('Tipo:' +req.body.type);
  if(req.body.type === 'external'){
    mailService.externalNote(id, note, function(result) {
      log('External note sent to client');
    });
  }
  
  ticketService.addNoteToTicket(id, note, function(result) {
    log('Inserted note to ticket');
  });

  if(req.body.note === undefined){
    var status = req.body.close !== undefined ? 'Closed' : 'Open';
    ticketService.updateTicketStatus(id, status , function(result) {
      log('Ticket status updated: ' +status);
    });
    if(status === 'Closed'){
      res.redirect(302, '/app/tickets');
      return;
    }
  }
  res.redirect(302, '/app/ticket/'+id);
});

router.post('/emails', upload.array(), function(req, res, next) {
  var msg = null;
  if (typeof req.body.mailinMsg === 'string') {
    msg = JSON.parse(req.body.mailinMsg);
  } else {
    msg = req.body.mailinMsg;
  }
  log('Parsed msg: ' + JSON.stringify(msg, null, 2));
  var ticketIdFromMailSubject = ticketService.findTicketIdInSubject(msg);
  if (ticketIdFromMailSubject) {
    var note = ticketService.createNote(msg);
    ticketService.addNoteToTicket(ticketIdFromMailSubject, note, function(result) {
      res.status(201).send(ticket);
    });
  } else {
    var ticket = ticketService.createTicket(msg);
    log('Created ticket from email');
    ticketService.insertTicket(ticket, function(result) {
      log('Inserted ticket to mongo');
      mailService.newTicketNotification(ticket, function(result) {
        log('Sending ticket');
      });
      res.status(201).send(ticket);
    });
  }
});

router.get('/ticket/:id/trash', function(req, res) {
  var id = req.params.id;
  var status = 'Trashed';
  ticketService.updateTicketStatus(id, status , function(result) {
    log('Ticket status updated: ' +status);
  });
  res.redirect(302, '/app/tickets');
  return;
});

router.get('/ticket/:id/untrash', function(req, res) {
  var id = req.params.id;
  var status = 'Open';
  ticketService.updateTicketStatus(id, status , function(result) {
    log('Ticket status updated: ' +status);
  });
  res.redirect(302, '/app/tickets');
  return;
});

router.post('/ticket/:id/save', function(req, res) {
  var id = req.params.id;
  console.log('req.body: ' + JSON.stringify(req.body, null, 2));
  var prop = req.body.name;
  var value = req.body.value;

  var ticket = {
  };

  ticket[prop] = value;
  ticketService.updateTicket(id, ticket, function(result) {
    res.status(200).end();
  });
});

router.post('/ticket/:id/:index/save', function(req, res) {
  var id = req.params.id;
  var index = req.params.index;
  var type = req.body.name;

  log('req.body: ' + JSON.stringify(req.body, null, 2));
  var value = req.body.value;

  var newNote = {
    body: value,
    index: index 
  };

  ticketService.updateNoteFromTicket(id, newNote, function(result) {
    if(type === 'external'){
      mailService.externalNote(id, newNote, function(result) {
      log('External note sent to client');
    });
    }
    res.status(200).end();
  });
});

router.head('/emails', function(req, res, next) {
  res.status(200).end();
});

router.get('/emails', function(req, res, next) {
  res.status(200).end();
});

router.post('/counter/:id/rename', function(req, res) {
  var oldId = req.params.id;
  var newId = req.body.newId;
  counterService.rename(oldId, newId, function(result) {
    log('Counter ' + oldId + ' renamed to ' + newId);
      ticketService.renameAllTickets(oldId, newId, function(result) {
    });
  });
  res.redirect(302, '/app/counters');
});

module.exports = router;
