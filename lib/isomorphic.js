/*
 * Module dependencies
 */
var express = require('express')
  , connect = require('connect')
  , utils = require('connect').utils
  , proto = require("./application")
  , Route = require('./router/route')
  , Router = require('./router')
  , req = express.request
  , res = require("./response");

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an isomorphic application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = express();
  utils.merge(app, proto);
  app.response = { __proto__: res };
  app.init();
  return app;
}

/**
 * Expose connect.middleware as isomorphic.*
 * for example `isomorphic.logger` etc.
 */

for (var key in connect.middleware) {
  Object.defineProperty(
      exports
    , key
    , Object.getOwnPropertyDescriptor(connect.middleware, key));
}

/**
 * Expose built-in middleware
 */
exports.bots = require("./middleware").bots;

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

// Error handler title
express.errorHandler.title = 'Isomorphic';
