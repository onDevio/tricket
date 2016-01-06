var expect = require('chai').expect;

describe('Ticket Service', function() {

  var mockongo = require('./mockongo')();
  var ticketService = require('../services/ticket-service')(mockongo);

  mockongo.db.collection('counters').findAndModify_result = {
    value: {
      seq: 1
    }
  };


  it('should create a new ticket with id generated from customer email', function(done) {
    var ticket = {
      customer: {
        email: 'person@customer.com'
      },
      title: 'Ticket Title',
      notes: [{
        'body': 'Ticket body',
        //'type': 'external',
        'worklog': 5,
        //'user' : req.user.displayName
      }]
    };
    ticketService.insertTicket(ticket, function(result) {
      expect(ticket.ticket_id).to.equal('CUSTOMER-1');
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
      customer: {
        email: 'person@customer.com'
      },
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

  it('should create a ticket from an email forwarded from GMail', function(done) {
    var fwdEmail = require('./gmailForward');
    var ticket = ticketService.createTicket(fwdEmail);
    expect(ticket.title).to.equal('Prueba');
    expect(ticket.notes[0].body).to.equal('Esto es una prueba.\n');
    expect(ticket.customer.email).to.equal('mefernandez@ondevio.com');
    expect(ticket.customer.name).to.equal('Mariano Eloy Fernández Osca');
    expect(ticket.notes[0].user).to.equal('mail');
    expect(ticket.notes[0].worklog).to.equal(0);
    done();
  });

  it('should update the customer', function(done) {
    var ticket = {
      customer: {
        name: 'New Customer',
        email: 'new@customer.com'
      }
    };
    ticketService.updateTicket('UNK-1', ticket, function(result) {
      expect(mockongo.db.collection('tickets').documents).to.include({
        "$set": {
          customer: {
            name: 'New Customer',
            email: 'new@customer.com'
          }
        }
      });
      done();
    });
  });
});
