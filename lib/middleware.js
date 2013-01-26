// TODO write the bots middleware

exports.bots = function() {
  return function(req, res, next) {
    next();
  }
};