'use strict';
var express = require('express');
var router = express.Router();
var log = require('debug')('tricket:api');

var ticketService = require('../services/ticket-service.js')();
var mailService = require('../services/mail-service.js')();
var counterService = require('../services/counter-service.js')();
var fsService = require('../services/fs-service.js')();


router.post( '/file-upload', fsService.upload.any(), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file
  log('req.files: ' + JSON.stringify(req.files, null, 2));
  return res.status( 200 ).send( req.files );
});

router.post( '/file-upload/:id', fsService.upload.any(), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file
  log('req.files: ' + JSON.stringify(req.files, null, 2));
  fsService.addFileToExistingTicket(req.params.id, req.files[0].filename);
  return res.status( 200 ).send( req.files );
});

router.get('/file/:id/:name', function(req, res) {
  fsService.getFile(req.params.id, req.params.name, res);
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
    fsService.createTicketFS(result); 
    log('Inserted ticket to mongo');
    res.redirect(302, '/app/tickets');
  });
});

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

router.post('/emails', fsService.upload.array(), function(req, res, next) {
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
