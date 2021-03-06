'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var loaderFactory = require('./plugin-loader');

module.exports = function (pluginsRepository) {


  var pluginsRepository = pluginsRepository ? (pluginsRepository instanceof Array ? pluginsRepository : [pluginsRepository]) : [];

  function findDataPluginName($element) {
    var classAttrValues = $element.attr('class');
    var matches = classAttrValues.match(/cms-(?:data|render)-(?:\w-?)+/);
    if (matches && matches.length) {
      return matches[matches.length-1];
    }
  }

  function transformElementToModel(element) {
    var modelItem = {};
    var $element = this.$(element);
    modelItem.name = findDataPluginName($element);
    modelItem.element = $element;
    modelItem.plugin = loaderFactory(pluginsRepository).loadPlugin(modelItem.name);
    return modelItem;
  }

  function findRenderPluginChildren(modelItem) {
    var $dataPluginElement = modelItem.element;
    var renderPluginElements = $dataPluginElement.find('[class*="cms-render"]');
    var children = _.chain(renderPluginElements)
      .map(transformElementToModel, {$: this.$})
      .value();
    modelItem.children = children;
    return modelItem;
  }

  // Build an execution model for the HTML passed as an argument
  function build(html) {
    var $ = cheerio.load(html);
    var elements = $('[class*="cms-"]');
    var loader = loaderFactory(pluginsRepository);

    var plugins = _.chain(elements)
      .map(function(el) {
        var $el = $(el);
        var clazz = $el.attr('class');
        var plugins = clazz.split(' ');

        var modelItems = _.chain(plugins)
          .filter(function(plugin) {
            var matches = plugin.match(/cms-(?:data|render)-(?:\w-?)+/);
            return !!matches;
          })
          .map(function(plugin) {
            var modelItem = {
              plugin: {
                name: plugin,
                instance: loader.loadPlugin(plugin),
                $element: $el
              }
            };
            return modelItem;
          })
          .value();
        return modelItems;
      })
      .flatten()
      .value();
    var model = {
      $html: $,
      plugins: plugins
    };
    return model;
  }

  // Render a model, starting with some options as data
  function render(model, options, callback) {


    if (!model) {
      callback();
      return;
    }


    if (!model.plugins) {
      if (model.$html) {
        callback(model.$html.html());
      } else {
        callback();
      }
      return;
    }

    // Varying arguments handling
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    var k = model.plugins.length;


    // see http://book.mixu.net/node/ch7.html
    function series(data, index) {

      if (index < k) {
        var plugin = model.plugins[index].plugin.instance;

        var $element = model.plugins[index].plugin.$element;

        plugin(data, $element, function(data) {
          var next = index + 1;
          series(data, next);
        });
      } else {
        var render = model.$html.html();
        callback(render);
      }
    }

    var data = [];
    if (!!options) {
      data.push(options);
    }
    series(data, 0);
  }

  return {
    build: build,
    render: render
  };
};
