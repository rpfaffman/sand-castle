var express = require('express');
var _ = require('underscore');
var partials = require('express-partials');
var app = express();
var sass = require('node-sass');
var port = 6000;

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

var sandbox = {};
sandbox.html = 'some html to start with';
sandbox.javascript = 'some javascript to start with';
sandbox.css = 'some css to start with';

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/html', function(request, response) {
  response.send(sandbox.html);
});

app.get('/javascript', function(request, response) {
  response.send(sandbox.javascript);
});

app.get('/css', function(request, response) {
  response.send(sandbox.css);
});

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function(socket) {
  socket.on('to_server.edit', function(data) {
    io.sockets.emit('to_client.edit', data);
  });
});

var edit = io
  .of('/edit')
  .on('connection', function(socket) {
    edit.emit('edit submit', { type: 'html', text: sandbox['html'] });

    socket.on('edit submit', function(data) {
      sandbox[data.type] = data.text;
      edit.emit('edit submit', data);
    });

    socket.on('edit sync', function(data) {
      socket.broadcast.emit(data.type + ' edit', data);
    });
  });

var chat = io
  .of('/chat')
  .on('connection', function(socket) {
    socket.set('alias', 'guest' + io.sockets.clients().length);
    socket.emit('message', { sender: 'Server', message: 'Welcome to Sand Castle!  Press [ENTER] to chat with other visitors.' });

    // sending messages
    socket.on('message', function(data) {
      socket.get('alias', function(err, alias) {
        data.sender = alias;
        if(data.message.length > 0) { chat.emit('message', data); };
      });
    });

    // changing usernames/aliases
    socket.on('alias', function(data) {
      socket.set('alias', data.args.join(' '));
      socket.emit('message', { sender: 'Server', message: 'Alias successfully changed.' });
    });
  });

console.log('Sand Castle server started on port ' + port + '.');
