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
    search: function(callback) {
      this.execute(callback, function(db, done) {
        search(db, done);
      });
    }
  };
};

function search(db, callback) {
  db.collection('customers').find({}).toArray(function(err, docs) {
    assert.equal(null, err);
    callback(docs);
  });
}
