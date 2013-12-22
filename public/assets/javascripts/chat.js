// Chat Namespace

var Chat = {};

Chat.Config = {
  socket: 'assign me',
  chatDivSelector: '#chat',
  chatAliasSelector: '#chat-alias-field',
  chatTextSelector: '#chat-send-field',
  submitSelector: '#chat-send-button'
};

Chat.Receiver = function() {
  var socket = Editor.Config.socket;

  this.init = function() {
    this.listen();
  };

  this.listen = function() {
    socket.on('to_client.message', function(data) {
      console.log('Received chat message from ' + data.sender + ': ' + data.message);
    });
  };

  this.init();
};

Chat.Sender = function() {
  var socket = Chat.Config.socket;
  var $submit = $(Chat.Config.submitSelector);
  var $aliasField = $(Chat.Config.chatAliasSelector);
  var $messageField = $(Chat.Config.chatTextSelector);

  this.init = function() {
    $submit.click(this.sendChatMessage);
  };

  this.sendChatMessage = function() {
    socket.emit('to_server.message',
                {
                  sender: $aliasField.val(),
                  message: $messageField.val()
                });
  };

  this.init();
};
