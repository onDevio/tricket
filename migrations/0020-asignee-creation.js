var assert = require('assert');
var mongodb = require('mongodb');

exports.up = function(db, next){
  db.collection('tickets').update({},{$set: { asignee: 'mail'}}, false, true);
  next();
};

exports.down = function(db, next){
  db.collection('tickets').update({},{$unset: { asignee: 'mail'}}, false, true);
  next();
};
