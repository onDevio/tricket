var expect = require('chai').expect;

describe('Ticket Service', function() {

  var msg = require('./mailinMsg');

  var mocko = {
    db: {
      collectionObject: {
        documents: [],
        findOne: function(query, callback) {
          callback({
            ticket_id: 'CUS-1'
          });
        },
        findAndModify: function(query, sort, doc, options, callback) {
          if (doc.$setOnInsert) {
            this.documents.push(doc.$setOnInsert);
          }
          var err = null;
          var result = {
            value: {
              seq: 1
            }
          };
          callback(err, result);
        },
        insert: function(doc, callback) {
          this.documents.push(doc);
          var err = null;
          var result = null;
          callback(err, result);
        }
      },
      collection: function(name) {
        return this.collectionObject;
      },
      close: function() {
        // NOOP
      }
    },
    connect: function(url, callback) {
      callback(null, this.db);
    }
  };

  var ticketService = require('../services/ticket-service')(mocko);



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
      expect(ticket.ticket_id).to.match(/CUS-\d+/);
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
      expect(ticket.ticket_id).to.match(/UNK-\d+/);
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
      //console.log(JSON.stringify(mocko.db.collectionObject.documents, null, 2));
      expect(mocko.db.collectionObject.documents).to.include({email: 'person@customer.com'});
      done();
    });
  });

  it('should find one ticket', function(done) {
    ticketService.findByTicketId('CUS-1', function(ticket) {
      expect(ticket.ticket_id).to.equal('CUS-1');
      done();
    });
  });

});
