/**
 * Module dependencies.
 */

var express = require('express')
  , EventEmitter = require('events').EventEmitter;


/**
 * Response prototype.
 */

var res = module.exports = {
  __proto__: express.response
};

/**
 * Render `view` with the given `options`.
 *
 * Options:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @param  {String} view
 * @param  {Object} options
 * @api public
 */

res.render = function(view, options){
  var self = this
    , options = options || {}
    , req = this.req
    , app = req.app;

  // merge res.locals
  options._locals = self.locals;

  if (this.app.enabled('streaming')) {
    var emitter = new EventEmitter

    emitter.on("data", function(str){
      self.write(str);
    });
    emitter.on("err", function(err){
      req.next(err)
    });
    emitter.on("end", function(){
      self.end();
    });

    // render
    app.render(view, options, emitter);
  }
  else {
    // default callback to respond
    var fn = function(err, str){
      if (err) return req.next(err);
      self.send(str);
    };

    // render
    app.render(view, options, fn);
  }
};
