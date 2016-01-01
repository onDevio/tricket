var expect = require('chai').expect;

describe('Counter Service', function() {

  var mockongo = require('./mockongo')();
  var ticketService = require('../services/counter-service')(mockongo);



  it('should rename a counter from UNK to KNU', function(done) {
    mockongo.db.collection('counters').findOneAndDelete_result = {
      value: {
        _id: 'KNU',
        seq: 1
      }
    };
    ticketService.rename('UNK', 'KNU', function(result) {
      expect(mockongo.db.collection('counters').documents).to.include({
        _id: 'KNU',
        seq: 1
      });
      done();
    });
  });

});
