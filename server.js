var cc, cs, filed, http, io, page, server, sio;

http = require('http');

cc = require('coffeecup');

cs = require('coffee-script');

page = require('./page');

sio = require('socket.io');

filed = require('filed');

server = http.createServer(function(req, res) {
  if (req.url === '/') {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    return res.end(cc.render(page, {
      js: '',
      coffee: ''
    }));
  } else {
    return filed('./public' + req.url).pipe(res);
  }
});

io = sio.listen(server);

io.sockets.on('connection', function(socket) {
  return socket.on('convert', function(data) {
    var js;
    js = "could not convert";
    try {
      return js = cs.compile(data, {
        bare: true
      });
    } catch (err) {
      return js = err.message;
    } finally {
      socket.emit('result', js);
    }
  });
});

server.listen(3000);
