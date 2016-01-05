var assert = require('assert');
var mongodb = require('mongodb');

exports.up = function(db, next){
  db.collection("counters").insert(
   {
      _id: "UNK",
      seq: 1
   }, function(err, result) {
     assert.equal(err, null);
     next();
   });
};

exports.down = function(db, next){
  db.collection('counters').drop(function(err, result) {
    assert.equal(err, null);
    next();
  });
};
