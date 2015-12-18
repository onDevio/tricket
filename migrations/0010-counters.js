
var mongodb = require('mongodb');

exports.up = function(db, next){
  db.collection("counters").insert(
   {
      _id: "UNK",
      seq: 1
   });
  next();
};

exports.down = function(db, next){
    next();
};
