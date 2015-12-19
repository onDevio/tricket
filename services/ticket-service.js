'use strict';

var log = require('debug')('tricket:services');
var assert = require('assert');


module.exports = function(aConnectionFactory, aUrl) {

  // @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/
  var connectionFactory = aConnectionFactory || require('mongodb').MongoClient;
  // Connection URL
  var url = aUrl || require('../config/config')().mongoUrl;

  return {
    connectionFactory: connectionFactory,
    execute: function(func) {
      connectionFactory.connect(url, function(err, db) {
        assert.equal(null, err);
        func(db);
        db.close();
      });
    },
    findByTicketId: function(id, callback) {
      this.execute(function(db) {
        findByTicketId(id, db, callback);
      });
    },
    createTicket: createTicket,
    insertTicket: function(ticket, callback) {
      this.execute(function(db) {
        insertTicket(ticket, db, callback);
      });
    },
    addNoteToTicket: function addNoteToTicket(id, note, callback) {
      this.execute(function(db) {
        addNoteToTicket(id, note, db, callback);
      });
    }
  };
};

function findByTicketId(id, db, callback) {
  // Find some documents
  db.collection('tickets').findOne({
    ticket_id: id
  }, callback);
}

function createTicket(msg) {
  return {
    title: msg.headers.subject || '<Empty subject>',
    notes: [{
      body: msg.text
    }],
    status: 'Open',
    worklog: 0,
    dateCreated: new Date().toISOString(),
    customer: msg.envelopeFrom.address
  };
}

function assignTicketId(ticket, db, callback) {
  var counter = getCounterName(ticket);
  getNextSequence(counter, db, function(nextSeq) {
    var newId = counter + "-" + nextSeq;
    ticket.ticket_id = newId;
    callback();
  });
}

function getCounterName(ticket) {
  var name = 'UNK';
  if (!!ticket.customer) {
    var re = /(?:@)([a-zA-Z]{3})/gi;
    // TODO Find out why it does not ignore non-capturing group (hence substring(1))
    name = ticket.customer.match(re).pop().substring(1).toUpperCase();
  }
  return name;
}

function getNextSequence(name, db, callback) {
  var query = {
    _id: name
  };
  var sort = null;
  var doc = {
    $inc: {
      seq: 1
    }
  };
  var options = {
    new: true,
    upsert: true
  };

  // @see http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findAndModify
  db.collection('counters').findAndModify(query, sort, doc, options, function(err, result) {
    assert.equal(null, err);
    callback(result.value.seq);
  });
}

function insertTicket(ticket, db, callback) {
  assignTicketId(ticket, db, function() {
    db.collection('tickets').insert(ticket, function(err, result) {
      assert.equal(err, null);
      addCustomer(ticket.customer, db, function() {
        callback(ticket);
      });
    });

  });
}

function addCustomer(customer, db, callback) {
  var query = {
    email: customer
  };
  var sort = null;
  var doc = {
    $setOnInsert: {
      email: customer
    }
  };
  var options = {
    new: true,
    upsert: true
  };

  // @see http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findAndModify
  db.collection('customers').findAndModify(query, sort, doc, options, function(err, result) {
    assert.equal(null, err);
    callback();
  });
}

function updateTicketStatus(id, status, db, callback) {
  db.collection('tickets').update({
    ticket_id: id
  }, {
    $set: {
      status: status
    }
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

function addNoteToTicket(id, note, db, callback) {
  db.collection('tickets').update({
    ticket_id: id
  }, {
    $push: {
      notes: note
    }
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
