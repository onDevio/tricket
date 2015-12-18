var config = require('../config/config')();
var log = require('debug')('tricket:services');

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = config.mongoUrl;

module.exports = {

  findByTicketId: findByTicketId,
  createTicket: createTicket,
  insertTicket: insertTicket,
  addNoteToTicket: addNoteToTicket
};

function findByTicketId(id, callback) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log('Connected correctly to server');

    // Get the documents collection
    var ticketsCollection = db.collection('tickets');
    // Find some documents
    ticketsCollection.findOne({
      ticket_id: id
    }).then(function(doc) {
      db.close();
      log(doc);
      callback(doc);
    });

  });
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
  var query = {_id: name};
  var sort = null;
  var doc = { $inc: { seq: 1 } };
  var options = { new: true, upsert: true };

  // @see http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findAndModify
  db.collection('counters').findAndModify(query, sort, doc, options, function(err, result) {
      assert.equal(null, err);
      callback(result.value.seq);
  });
}

function insertTicket(ticket, callback) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    assignTicketId(ticket, db, function() {
      // Get the documents collection
      var ticketsCollection = db.collection('tickets');

      // Find some documents
      ticketsCollection.insert(ticket, function(err, result) {
        assert.equal(err, null);
        callback(ticket);
      });

    });


  });
}

function updateTicketStatus(id, status, callback) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log('Connected correctly to server');

    // Get the documents collection
    var ticketsCollection = db.collection('tickets');

    // Find some documents
    ticketsCollection.update({
      ticket_id: id
    }, {
      $set: {
        status: status
      }
    }, function(err, result) {
      assert.equal(err, null);
      console.log('Ticket updated' + status);
      callback(result);
    });

  });
}

function addNoteToTicket(id, note, callback) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log('Connected correctly to server');

    // Get the documents collection
    var ticketsCollection = db.collection('tickets');

    // Find some documents
    ticketsCollection.update({
      ticket_id: id
    }, {
      $push: {
        notes: note
      }
    }, function(result) {
      db.close();
      log(result);
      callback(result);
    });

  });
}
