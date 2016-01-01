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
    },
    rename: function(oldId, newId, callback) {
      this.execute(callback, function(db, done) {
        rename(oldId, newId, db, done);
      });
    }
  };
};

function search(db, callback) {
  log('Searching for counters in Mongo');
  db.collection('counters').find({}).toArray(function(err, docs) {
    assert.equal(null, err);
    callback(docs);
  });
}

function rename(oldId, newId, db, callback) {
  log('Renaming counter ' + oldId + ' to ' + newId + 'in Mongo');
  // Can't modify _id, need to add and remove it
  db.collection('counters').findOneAndDelete({ _id: oldId}, function(err, result) {
    assert.equal(err, null);
    var seq = result.value.seq || 1;
    db.collection('counters').insert({
        _id: newId,
        seq: seq
      }, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
  });
}
