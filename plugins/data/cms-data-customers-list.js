'use strict';

var log = require('debug')('temply:cms-data-customers-list');
var clientService = require('../../services/client-service')();

module.exports = function(data, $element, callback) {
  clientService.search(function(clients) {
    data[0].clients = clients;
    callback(data);
  });
};
