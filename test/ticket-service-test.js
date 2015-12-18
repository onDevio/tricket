var expect = require('chai').expect,
  app = require('../app');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
var config = require('../config/config')();
// Connection URL
var url = config.mongoUrl;

describe('Ticket Service', function() {

  var readFileOptions = {
    encoding: 'utf8',
    flag: 'r'
  };

  var msg = require('./mailinMsg');

  var ticketService = require('../services/ticket-service');

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

      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('customers').find({
          email: 'person@customer.com'
        }).toArray(function(err, docs) {
          assert.equal(null, err);
          expect(docs).to.have.length(1);
          done();
        });
      });

    });
  });



});
