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
    execute: function(callback, func) {
      connectionFactory.connect(url, function(err, db) {
        assert.equal(null, err);
        func(db, function() {
          db.close();
          callback.apply(null, arguments);
        });
      });
    },
    findByTicketId: function(id, callback) {
      this.execute(callback, function(db, done) {
        findByTicketId(id, db, done);
      });
    },
    createTicket: createTicket,
    findTicketIdInSubject: findTicketIdInSubject,
    insertTicket: function(ticket, callback) {
      this.execute(callback, function(db, done) {
        insertTicket(ticket, db, done);
      });
    },
    updateTicketStatus: function(id, note, callback) {
      this.execute(callback, function(db, done) {
        updateTicketStatus(id, note, db, done);
      });
    },
    asignTicket: function(id, user, callback) {
      this.execute(callback, function(db, done) {
        asignTicket(id, user, db, done);
      });
    },
    rejectTicket: function(id, callback) {
      this.execute(callback, function(db, done) {
        rejectTicket(id, db, done);
      });
    },
    addNoteToTicket: function(id, note, callback) {
      this.execute(callback, function(db, done) {
        addNoteToTicket(id, note, db, done);
      });
    },
    renameAllTickets: function(id, note, callback) {
      this.execute(callback, function(db, done) {
        renameAllTickets(id, note, db, done);
      });
    },
    updateTicket: function(id, changeSet, callback) {
      this.execute(callback, function(db, done) {
        updateTicket(id, changeSet, db, done);
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
  var date = new Date().toISOString();
  return {
    title: msg.headers.subject || '<Empty subject>',
    status: 'Open',
    asignee: 'Not asigned',
    dateCreated: date,
    customer: {
      email: msg.from[0].address,
      name: msg.from[0].name
    },
    notes: [{
      body: msg.text,
      type: 'mail',
      dateCreated: date,
      worklog: 0,
      user: 'mail'
    }]
  };
}

function findTicketIdInSubject(msg) {
  var subject = msg.headers.subject;
  if (!subject) {
    return;
  }
  var re = /\[(\w+-\d+)\]/;
  var match = subject.match(re);
  if (match && match.length>1) {
    return match[1];
  }
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
  if (ticket.customer && ticket.customer.email) {
    var re = /(?:@)(\w+)/gi;
    var match = ticket.customer.email.match(re);
    if (match && match.length > 0) {
      name = match[0].substring(1).toUpperCase();
    }
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
  var query = customer ? {
    email: customer.email
  } : {};
  var sort = null;
  var doc = {
    $setOnInsert: customer
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

function asignTicket(id, user, db, callback) {
  db.collection('tickets').update({
    ticket_id: id
  }, {
    $set: {
      asignee: user
    }
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

function rejectTicket(id, db, callback) {
  //TODO: Check if ticket is owned
  db.collection('tickets').update({
    ticket_id: id
  }, {
    $set: {
      asignee: 'Not asigned'
    }
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
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

function renameAllTickets(oldId, newId, db, callback) {
  db.collection('tickets').find({ticket_id: {$regex: '^' + oldId + '-.*'} }).each(function(err, ticket) {
    if (err || !ticket) {
      return;
    }
    var match = ticket.ticket_id.match(/(\w+)-(\d+)/);
    if (match && match.length > 2) {
      var counterName = newId;
      var counterSeq = match[2];
      var ticket_id = counterName + '-' + counterSeq;
      db.collection('tickets').update({_id: ticket._id}, {$set: {ticket_id: ticket_id}});
    }
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

function updateTicket(id, changeSet, db, callback) {
  db.collection('tickets').update({
    ticket_id: id
  }, {
    $set: changeSet
  }, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
