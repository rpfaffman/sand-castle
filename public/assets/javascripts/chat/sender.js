Chat.Sender = function() {
  var socket = Chat.Config.socket;
  var $messageField = $(Chat.Config.chatTextSelector);

  this.sendMessage = function() {
    socket.emit('message', { message: $messageField.html() });
  };

  this.sendCommand = function() {
    var messageFieldText = $messageField.html().split(' ');
    socket.emit(messageFieldText[0], { args: messageFieldText.slice(1) });
  };
};
