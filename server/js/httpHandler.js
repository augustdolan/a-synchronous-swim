const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
// Did we see where this path goes?? Aug
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

// req = request, res = response
module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  if (req.method === 'GET') {
    var random = Math.floor(Math.random() * (3 - 0 + 1) + 0);
    var keypresses = ['left', 'right', 'up', 'down'];
    res.write(keypresses[random]);
  }
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
