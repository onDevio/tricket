'use strict';

var request = require('superagent');
var parseString = require('xml2js').parseString;
var _ = require('lodash');
var log = require('debug')('temply:cms-data-tickets');
var config = require('../../config/config')();

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/**
 * Returns ticket using MongoDb
 * @see http://mongoosejs.com/docs/index.html
 */
module.exports = function(data, $element, callback) {
 findByTicketId(function(data) {
  log("Ticket: " + JSON.stringify(data));
   callback(data);
 });
}

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/#find-all-documents
function findByTicketId(callback) {
  // Connection URL
  var url = config.mongoUrl;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log("Connected correctly to server");

    // Get the documents collection
    var collection = db.collection('tickets');
    // Find some documents
    collection.findOne({ticket_id:'CUS-1'}).then(function(doc) {
      db.close();
      callback(doc);
    });

  });

}
