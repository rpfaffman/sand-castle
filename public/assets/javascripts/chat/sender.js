Chat.Sender = function() {
  var socket = Chat.Config.socket;
  var $submit = $(Chat.Config.submitSelector);
  var $aliasField = $(Chat.Config.chatAliasSelector);
  var $messageField = $(Chat.Config.chatTextSelector);

  this.init = function() {
    $submit.click(this.sendMessage);
  };

  this.sendMessage = function() {
    socket.emit('to_server.message', { sender: $aliasField.val(), message: $messageField.html() });
  };

  this.init();
};
