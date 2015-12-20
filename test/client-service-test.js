'use strict';

var expect = require('chai').expect;

describe('Client Service', function() {

  var mockongo = require('./mockongo')();
  var clientService = require('../services/client-service')(mockongo);

  it('should list all clients', function(done) {
    mockongo.db.collection('customers').find_result = [{
      email: 'person@customer.com'
    }];
    clientService.search(function(result) {
      expect(result).to.include({email: 'person@customer.com'});
      done();
    });
  });

});
