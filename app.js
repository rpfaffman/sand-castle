var express = require('express');
var _ = require('underscore');
var partials = require('express-partials');
var app = express();
var sass = require('node-sass');
var port = process.env.PORT || 3000;

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
sandbox.html = '';
sandbox.javascript = '';
sandbox.css = '';

app.get('/', function(request, response) {
  response.render('index');
});

var io = require('socket.io').listen(app.listen(port));

var edit = io
  .of('/edit')
  .on('connection', function(socket) {
    edit.emit('edit submit', { type: 'html', code: sandbox['html'] });

    socket.on('code submit', function(data) {
      sandbox[data.type] = data.code;
      (data.type === 'javascript') ? socket.broadcast.emit('code submit', data) : edit.emit('code submit', data);
    });

    socket.on('code edit', function(data) { socket.broadcast.emit('code edit', data); });
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
