var assert = require('assert');
var mongodb = require('mongodb');

exports.up = function(db, next) {
  db.collection('tickets').insertMany([{
    "customer": "Customer",
    "ticket_id": "CUS-1",
    "status": "Open",
    "title": "New Ticket 1",    
    "dateCreated": "2015-12-14T12:12:47.901Z",
    "notes": [{
      "body": "Nota inicial",
      "type": "mail",
      "dateCreated": "2015-12-14T12:12:47.901Z",
      "worklog": 0,
      "user" : "mail"  
    },{
      "body": "Autorespuesta",
      "type": "external",
      "dateCreated": "2015-12-14T12:12:47.901Z",
      "worklog": 0,
      "user" : "mail"  
    },{
      "body": "Nota 1",
      "type": "external",
      "dateCreated": "2015-12-14T12:12:47.901Z",
      "worklog": 3,
      "user" : "lmunoz"  
    }]    
  }], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("Inserted 1 documents into the document collection");
    next();
  })

};

exports.down = function(db, next) {
  db.collection('tickets').drop(function(err, result) {
    assert.equal(err, null);
    console.log("Dropped collection tickets");
    next();
  });
};
