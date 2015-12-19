'use strict';

var log = require('debug')('temply:cms-data-clients');
var clientService = require('../../services/client-service')();

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
