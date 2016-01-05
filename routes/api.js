var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

var log = require('debug')('tricket:api');

var ticketService = require('../services/ticket-service.js')();
var mailService = require('../services/mail-service.js')();
var counterService = require('../services/counter-service.js')();

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
  var ticket = {
    customer: {
      email: req.body.customer,
      name: ''
    },
    asignee: 'Not asigned',
    status: req.body.close !== undefined ? 'Closed' : 'Open',
    title: req.body.title || '<Empty subject>',
    dateCreated: new Date().toISOString(),
    notes: [note]
  };
  ticketService.insertTicket(ticket, function(result) {
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

  //TODO: if external, send mail to customer
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

  var ticket = ticketService.createTicket(msg);
  log('Created ticket from email');
  ticketService.insertTicket(ticket, function(result) {
    log('Inserted ticket to mongo');
    mailService.newTicketNotification(ticket, function(result) {
      log('Sending ticket');
    });
    res.status(201).send(ticket);
  });
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
  res.status(200).end();
  return;
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
