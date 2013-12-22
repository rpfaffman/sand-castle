// Chat Namespace

var Chat = {};

Chat.Config = {
  socket: 'assign me'
};

Chat.Receiver = function() {
  var socket = Editor.Config.socket;

  this.listen = function() {
    socket.on('to_client.message', function(data) {
      console.log('Received chat message from ' + data.sender + ': ' + data.message);
    });
  };
};

Chat.Sender = function() {

};
