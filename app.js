var express = require('express');
var _ = require('underscore');
var partials = require('express-partials');
var app = express();
var sass = require('node-sass');
var port = 3000;

// configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(partials());
app.use(sass.middleware({
  src: __dirname,
  dest: __dirname + '/public',
  debug: true
}));

app.get('/', function(request, response) {
  response.render('index');
});

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function(socket) {
  console.log('Connection established!');

  //chat crap
  socket.emit('to_client.message', { sender: 'server', message: 'Welcome to Sand Castle!' });
  socket.on('to_server.message', function(data) {
    io.sockets.emit('to_client.message', data);
  });

  //edit crap
  socket.on('to_server.edit', function(data) {
    io.sockets.emit('to_client.edit', data);
  });
});

console.log('Sand Castle server started on port ' + port + '.');
