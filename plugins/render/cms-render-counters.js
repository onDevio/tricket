'use strict';

var log = require('debug')('temply:cms-render-counters');
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
    $row.find('td').eq(0).text(customer._id);
    var seq = customer.seq ? customer.seq.toString() : "";
    $row.find('td').eq(1).text(seq);
    $row.find('form').attr('action', '/api/counter/' + customer._id + '/rename');
    $element.append($row);
  });

  callback(data);

};
