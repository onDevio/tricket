'use strict';

var log = require('debug')('tricket:services');
var assert = require('assert');
var sesConfig = require('../config/ses.js');
var ticketService = require('../services/ticket-service.js')();
var markdown = require( "markdown" ).markdown;
var ses = require('node-ses')
  , client = ses.createClient({ key: sesConfig.key, secret: sesConfig.secret, amazon: sesConfig.amazon});


module.exports = function() {
  return {
    newTicketNotification: newTicketNotification,
    externalNote: externalNote
  };
};

function newTicketNotification(ticket, callback) {
  log('Sending mail about ticket: '+ ticket.title);
  client.sendEmail({
    to: sesConfig.notificationUsers,
    from: 'info@ondevio.com',
    subject: 'New Ticket recieved',
    message: 'There is a new Ticket from: '+ticket.customer+' with title: '+ticket.title,
    altText: 'There is a new Ticket from: '+ticket.customer+' with title: '+ticket.title
  }, function (err, data, res) {
    assert.equal(err, null);
    callback(res);
  });
}

function externalNote(id, note, callback) {  
  ticketService.findByTicketId(id, function(ticket){
    console.log('Sending note about ticket: '+ ticket.title);
    var md = markdown.toHTML(note.body);
    console.log(md);
    client.sendEmail({
      to: ticket.client,
      from: 'info@ondevio.com',
      subject: '['+ticket.ticket_id+'] - '+ticket.title,
      message: md,
      altText: note.body
    }, function (err, data, res) {
      assert.equal(err, null);
      callback(res);
    });
  });
}

