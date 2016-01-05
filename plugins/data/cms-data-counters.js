'use strict';

var log = require('debug')('temply:cms-data-counters');
var clientService = require('../../services/counter-service')();

module.exports = function(data, $element, callback) {
  clientService.search(function(clients) {
    var data = {
      "contents": clients,
      "page": {
        "current": 1,
        "size": clients.length,
        "total": clients.length
      }
    };
    callback(data);
  });
};
