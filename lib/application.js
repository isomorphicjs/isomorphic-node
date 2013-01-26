/**
 * Module dependencies.
 */

var application = require('express/lib/application')
  // , Router = require('./router')
  , middleware = require('./middleware')
  , debug = require('debug')('isomorphic:application')
  , View = require('./view');

var app = exports = module.exports = {__proto__: application};

app.init = function() {
  application.init.apply(this);
  this.isomorphicDefaults();
};

app.isomorphicDefaults = function() {
  this.set('platform', (typeof window == "undefined")?"server":"client");
  
  // TODO wrap router to enable whitelisting on layout paths
}

app.platform = function(platform, fn){
  var platforms = 'all'
    , args = [].slice.call(arguments);
  fn = args.pop();
  if (args.length) platforms = args;
  if ('all' == platforms || ~platforms.indexOf(this.settings.platform)) fn.call(this);
  return this;
};

// Store the express render method
var _render = app.render;

app.render = function(name, options, emitter) {
  var cache = this.cache;

  if (this.disabled("server render")) {
    name = this.get("layout") || "layout";
  };

  // support standard way
  if ('function' == typeof options || 'function' == typeof emitter) {
    return _render.apply(this, [name, options, emitter]);
  }

  // Streaming is enabled
  // TODO
  emitter.emit("data", "Hello ");

  setTimeout(function(){
    emitter.emit("data", "World ");
  }, 1000);
  setTimeout(function(){
    emitter.emit("data", "to you");
  }, 2000);

  setTimeout(function(){
    emitter.emit("end");
  }, 3000);

};