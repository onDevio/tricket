'use strict';

var log = require('debug')('tricket:services');
var assert = require('assert');
var sesConfig = require('../config/ses.js');
var ses = require('node-ses')
  , client = ses.createClient({ key: sesConfig.key, secret: sesConfig.secret });


module.exports = function(aConnectionFactory, aUrl) {

  return {
    newTicketNotification: function(ticket, callback) {
      this.execute(callback, function(done) {
        newTicketNotification(ticket, done);
      });
    }
  };
};

function newTicketNotification(ticket, callback) {
  client.sendEmail({
    to: sesConfig.notificationUsers,
    from: 'info@ondevio.com',
    subject: 'New Ticket recieved',
    message: 'There is a new Ticket from: '+ticket.customer+' with title: '+ticket.title,
    altText: 'There is a new Ticket from: '+ticket.customer+' with title: '+ticket.title
  }, function (err, data, res) {
    assert.equal(err, null);
    callback(result);
  });
}

