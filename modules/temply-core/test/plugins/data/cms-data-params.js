module.exports = function(data, $element, callback) {
  var data = data || [];
  var options = data.pop();
  var param = options.param;
  data.push('cms-data-params got data: ' + param);
  callback(data);
};
