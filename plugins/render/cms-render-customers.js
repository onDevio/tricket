'use strict';

var log = require('debug')('temply:cms-render-customers');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }

  var customers = data.contents;
  var $rowTpl = $element.find('tr').remove();

  customers.forEach(function(customer){
    var $row = $rowTpl.clone();
    $row.find('td').eq(0).text(customer.name);
    $row.find('td').eq(1).text(customer.email);
    $element.append($row);
  });

  callback(data);

};
