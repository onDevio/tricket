'use strict';

var log = require('debug')('temply:cms-render-user');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }

  var user = data[0].user;
  $element.find('.user').append('<span>'+user.displayName+'  </span><img class="img-thumbnail" src="'+user.photos[0].value+'">');
  callback(data);
}
