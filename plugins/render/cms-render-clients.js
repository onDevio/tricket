'use strict';

var log = require('debug')('temply:cms-render-clients');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }

  var clients = data.contents;
  var $rowTpl = $element.find('tr').remove();

  clients.forEach(function(client){
    var $row = $rowTpl.clone();
    $row.find('td').eq(0).text(client.name);
    $row.find('td').eq(1).text(client.email);
    $element.append($row);
  });

  callback(data);

};
