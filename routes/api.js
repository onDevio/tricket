var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

var log = require('debug')('tricket:api');
var config = require('../config/config')();

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


router.post('/ticket/new', function(req, res) {
  console.log(req.body);
  var ticket = {
    title: req.body.title || '<Empty subject>',
    notes: [{
      body: req.body.body
    }],    
    status: req.body.close !== undefined ? "Closed" : "Open", 
    worklog: req.body.workload,
    dateCreated: new Date().toISOString(),
    customer: req.body.customer
  };
  insertTicket(ticket, function(result) {
    log("Inserted ticket to mongo");
    res.redirect(302, '/app/tickets');
  }); 
});

router.post('/emails', upload.array(), function(req, res, next) {
  var msg = null;
  if (typeof req.body.mailinMsg === 'string') {
    msg = JSON.parse(req.body.mailinMsg);
  } else {
    msg = req.body.mailinMsg;
  }
  log("Parsed msg: " + JSON.stringify(msg, null, 2));

  var ticket = createTicket(msg);
  log("Created ticket from email");
  insertTicket(ticket, function(result) {
    log("Inserted ticket to mongo");
    res.status(201).send(ticket);
  });
});

router.head('/emails', function(req, res, next) {
  res.status(200).end();
});

router.get('/emails', function(req, res, next) {
  res.status(200).end();
});

module.exports = router;


function createTicket(msg) {
  return {
    title: msg.headers.subject || '<Empty subject>',
    notes: [{
      body: msg.text
    }] ,
    status: "Open",
    worklog: 0,
    dateCreated: new Date().toISOString(),
    customer: msg.envelopeFrom.address
  };
}

function insertTicket(ticket, callback) {
  // Connection URL
  var url = config.mongoUrl;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log("Connected correctly to server");

    // Get the documents collection
    var collection = db.collection('tickets');
    // Find some documents
    collection.insert(ticket, function(err, result) {
      assert.equal(err, null);
      console.log("Inserted ticket");
      callback(result);
    });

  });

}
