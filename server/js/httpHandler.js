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
  req.on('error', (err) => {
    console.error(err);
    res.statusCode = 400;
    res.end()
  })

  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.url === '/') {
    if (req.method === 'OPTIONS') {
      res.writeHead(200, headers);
      res.end();
      next()
    } else if (req.method === 'GET') {
      res.writeHead(200, headers);
      //  check the re url === /
      res.on('error', (err) => {
        console.error(err);
      });
      if (messageQueue === null) {
        res.write('up');
      } else {
        res.write(messageQueue)
      }
      res.end();
      next()
    } else {
      res.end();
      next()
    }
  } else if (req.url === '/' + module.exports.backgroundImageFile) {
    console.log('/' + module.exports.backgroundImageFile, 'req.url', req.url)
    if (req.method === 'GET') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
        } else {
          console.log('successful read of background.jpg');
          res.writeHead(200, {'Content-Type':'image/jpeg'});
          res.write(data);
        }
        res.end();
        next()
      });
    } else if (req.method === 'POST') {
      var data = Buffer.alloc(0);
      let file;
      req.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      }).on('end', () => {
        file = multipart.getFile(data);
        fs.writeFile(module.exports.backgroundImageFile, file.data, (err, data) => {
          if (err) {
            res.writeHead(404, headers);
          } else {
            res.writeHead(201, headers);
          }
          res.end();
          next()
        })
      })
    } else {
      res.end();
      next()
    }
  } else {
    res.end();
    next()
  }
};