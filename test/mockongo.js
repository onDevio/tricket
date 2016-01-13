module.exports = function() {

  return {
    db: {
      collectionFactory: function() {
        return {
          documents: [],
          find_result: [],
          find: function(query) {
            var that = this;
            return {
              toArray: function (callback) {
                callback(null, that.find_result);
              }
            };
          },
          findOne_result: {},
          findOne: function(query, callback) {
            var err = null;
            callback(err, this.findOne_result);
          },
          findAndModify_result: {},
          findAndModify: function(query, sort, doc, options, callback) {
            if (doc.$setOnInsert) {
              this.documents.push(doc.$setOnInsert);
            }
            var err = null;
            callback(err, this.findAndModify_result);
          },
          insert: function(doc, callback) {
            this.documents.push(doc);
            var err = null;
            var result = null;
            callback(err, result);
          },
          update: function(query, doc, callback) {
            this.documents.push(doc);
            var err = null;
            var result = null;
            callback(err, result);
          },
          findOneAndDelete_result: {},
          findOneAndDelete: function(query, callback) {
            var err = null;
            var result = {
              value: this.findOneAndDelete_result
            };
            callback(err, result);
          }
        };
      },
      collections: {},
      collection: function(name) {
        if (!this.collections[name]) {
          this.collections[name] = this.collectionFactory();
        }
        return this.collections[name];
      },
      close: function() {
        // NOOP
      }
    },
    connect: function(url, callback) {
      callback(null, this.db);
    }
  };
};
