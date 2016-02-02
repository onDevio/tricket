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
  var params = data[0];
  var query = {
    customer : '',
  };
  if(!params.search){
    if(!params.customer){
      callback(data);
      return;
    }
  }
  query.customer = params.search.length>0 ? params.search : params.customer;

  query.start = new Date('2015').toISOString();
  if(params.start){
    query.start = new Date(params.start).toISOString();
  }
  
  query.end = new Date().toISOString();
  //Dudas
  if(params.end){
    query.end = new Date(params.end).toISOString();
  }
  
  findByCustomerRange(query, function(tickets) {
   var data = {
     'contents': tickets,
     'page': {
       'current': 1,
       'size': tickets.length,
       'total': tickets.length
     }
    };
    callback(data);
  });
};

// @see http://mongodb.github.io/node-mongodb-native/2.1/getting-started/quick-tour/#find-all-documents
function findByCustomerRange(query, callback) {
  // Connection URL
  var url = config.mongoUrl;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    log('Connected correctly to server');

    // Get the documents collection
    var collection = db.collection('tickets');
    var search = {
                 'customer.email': {'$regex': query.customer},
                 'dateCreated' : {
                                 $gt: query.start,
                                 $lt:  query.end
                                },
                 'status': {$ne:"Trashed"}
               };

    // Find some documents
    collection.find(search).toArray(function(err, docs) {
      db.close();
      log(docs);
      callback(docs);
    });

  });

}