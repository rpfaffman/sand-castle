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
  var socket = Chat.Config.socket;
  var $chat = $(Chat.Config.chatDivSelector);

  this.init = function() {
    this.listen();
  };

  this.listen = function() {
    socket.on('to_client.message', function(data) {
      renderChatItem(data.sender, data.message);
    });
  };

  // private methods

  var renderChatItem = function(alias, message) {
    var chatItem = $('<div class="chat-item"><b>' + alias + ':</b> ' + message + '</div>').hide();
    $(chatItem).appendTo($chat).slideDown();
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
    socket.emit('to_server.message', { sender: $aliasField.val(), message: $messageField.val() });
    $messageField.val('');
  };

  this.init();
};
