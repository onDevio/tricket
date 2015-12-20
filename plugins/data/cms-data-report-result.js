'use strict';

var log = require('debug')('temply:cms-data-report-result');
var config = require('../../config/config')();

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/**
 * List tickets using MongoDb
 * @see http://mongoosejs.com/docs/index.html
 */
module.exports = function(data, $element, callback) {
 var customer = data; 
 findByCustomerRange(function(tickets) {
   var data = {
     "contents": tickets,
     "page": {
       "current": 1,
       "size": tickets.length,
       "total": tickets.length
     }
   };
   callback(data);
 });


}

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/#find-all-documents
function findByCustomerRange(callback) {
  // Connection URL
  var url = config.mongoUrl;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log("Connected correctly to server");

    // Get the documents collection
    var collection = db.collection('tickets');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      db.close();
      callback(docs);
    });

  });

}