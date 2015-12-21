var assert = require('assert');
var mongodb = require('mongodb');

exports.up = function(db, next){
  db.collection('customers').insert({
  	name: 'Person',
    email: 'person@customer.com'
  }, function(err, result) {
    assert.equal(err, null);
    next();
  });
};

exports.down = function(db, next){
    next();
};
