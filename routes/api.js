var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

var log = require('debug')('tricket:api');

var ticketService = require('../services/ticket-service.js');

router.post('/ticket/new', function(req, res) {
  //log(req.body);
  //var id = req.body.customer.substring(0,3).toUpperCase()+'-'+Math.floor(Math.random()*100);
  var date = new Date();
  var note = {
    'body': req.body.body,
    'type': 'external',
    'dateCreated': date.toISOString(),
    'worklog': req.body.worklog || 0,
    'user' : req.user.displayName
  };
  var ticket = {
    customer: req.body.customer,
    //ticket_id: id,
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
    res.status(201).send(ticket);
  });
});

router.head('/emails', function(req, res, next) {
  res.status(200).end();
});

router.get('/emails', function(req, res, next) {
  res.status(200).end();
});

module.exports = router;
