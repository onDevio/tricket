var expect = require('chai').expect;

describe('Ticket Service', function() {

  var msg = require('./mailinMsg');

  var mockongo = require('./mockongo')();
  var ticketService = require('../services/ticket-service')(mockongo);

  mockongo.db.collection('counters').findAndModify_result = {
    value: {
      seq: 1
    }
  };


  it('should create a new ticket with id generated from customer email', function(done) {
    var ticket = {
      customer: 'person@customer.com',
      title: 'Ticket Title',
      notes: [{
        'body': 'Ticket body',
        //'type': 'external',
        'worklog': 5,
        //'user' : req.user.displayName
      }]
    };
    ticketService.insertTicket(ticket, function(result) {
      expect(ticket.ticket_id).to.equal('CUS-1');
      done();
    });
  });

  it('should create a new ticket with id generated as UNK-N when no customer is found', function(done) {
    var ticket = {
      //customer: 'person@customer.com',
      title: 'Ticket Title',
      notes: [{
        'body': 'Ticket body',
        //'type': 'external',
        'worklog': 5,
        //'user' : req.user.displayName
      }]
    };
    ticketService.insertTicket(ticket, function(result) {
      expect(ticket.ticket_id).to.equal('UNK-1');
      done();
    });
  });

  it('should add a new customer upon new ticket', function(done) {
    var ticket = {
      customer: 'person@customer.com',
      title: 'Ticket Title',
      notes: [{
        'body': 'Ticket body',
        //'type': 'external',
        'worklog': 5,
        //'user' : req.user.displayName
      }]
    };
    ticketService.insertTicket(ticket, function(result) {
      //console.log(JSON.stringify(mockongo.db.collection('customers').documents, null, 2));
      expect(mockongo.db.collection('customers').documents).to.include({
        email: 'person@customer.com'
      });
      done();
    });
  });

  it('should find one ticket', function(done) {
    mockongo.db.collection('tickets').findOne_result = {
      ticket_id: 'CUS-1'
    };
    ticketService.findByTicketId('CUS-1', function(ticket) {
      expect(ticket.ticket_id).to.equal('CUS-1');
      done();
    });
  });

});
