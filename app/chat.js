var App = require('./config');
var io = App.Config.io;

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

