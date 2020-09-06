var parser = require('parse-multipart');

module.exports.getBoundary = function(buffer) {
  console.log(typeof buffer);
  var finder = /--(----\w+)\b/;
  var boundary = buffer.toString().match(finder);
  return boundary ? boundary[1] : null;
};

module.exports.parse = function(buffer) {
  console.log(typeof buffer);
  var boundary = module.exports.getBoundary(buffer);
  return parser.Parse(buffer, boundary);
};

module.exports.getFile = function(buffer) {
  console.log(typeof buffer);
  var parts = module.exports.parse(buffer);
  for (var part of parts) {
    // return first part with filename and data keys
    if (part.filename && part.data) {
      return part;
    }
  }
  return null;
};

