var assert = require('assert');
var mongodb = require('mongodb');

exports.up = function(db, next){
  db.collection('tickets').update({},{$set: { asignee: 'Not asigned'}}, false, true);
  next();
};

exports.down = function(db, next){
  db.collection('tickets').update({},{$unset: { asignee: 'Not asigned'}}, false, true);
  next();
};
