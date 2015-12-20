'use strict';

var log = require('debug')('temply:cms-render-customer-list');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }

  var customers = data[0].clients;
  var $option = $element.find('option');

  customers.forEach(function(customer){
    var $row = $option.clone();
    $row.text(customer.email).attr('value', customer.email);
    $element.append($row);
  });

  callback(data);

};
