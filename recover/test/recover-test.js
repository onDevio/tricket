'use strict';

var assert = require('chai').assert;
var recover = require('../recover');

describe.only('Recovery process', function() {

  it('parses 02/06/2017 into 2017-06-02T00:00:00.000Z', function(done) {
    assert.equal(recover.parseDateToISOString('02/06/2017'), '2017-06-02T00:00:00.000Z');
    done();
  });

  it('parses 3 days ago into 2017-06-12T00:00:00.000Z', function(done) {
    var fromDate = new Date('2017-06-15');
    assert.equal(recover.parseRelativeDateToISOString(fromDate, '3 days ago'), '2017-06-12T00:00:00.000Z');
    done();
  });

  it('parses 5 months ago into 2017-01-15T00:00:00.000Z', function(done) {
    var fromDate = new Date('2017-06-15');
    assert.equal(recover.parseRelativeDateToISOString(fromDate, '5 months ago'), '2017-01-15T00:00:00.000Z');
    done();
  });

  it('parses a year ago into 2017-01-15T00:00:00.000Z', function(done) {
    var fromDate = new Date('2017-06-15');
    assert.equal(recover.parseRelativeDateToISOString(fromDate, 'a year ago'), '2016-06-15T00:00:00.000Z');
    done();
  });

  it('parses a month ago into 2017-01-15T00:00:00.000Z', function(done) {
    var fromDate = new Date('2017-06-15');
    assert.equal(recover.parseRelativeDateToISOString(fromDate, 'a month ago'), '2017-05-15T00:00:00.000Z');
    done();
  });

  it('parses a day ago ago into 2017-01-15T00:00:00.000Z', function(done) {
    var fromDate = new Date('2017-06-15');
    assert.equal(recover.parseRelativeDateToISOString(fromDate, 'a day ago'), '2017-06-14T00:00:00.000Z');
    done();
  });
  
  
  
});
