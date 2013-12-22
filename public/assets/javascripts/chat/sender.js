Chat.Sender = function() {
  var socket = Chat.Config.socket;
  var $submit = $(Chat.Config.submitSelector);
  var $messageField = $(Chat.Config.chatTextSelector);

  this.init = function() {
    $submit.click(this.sendMessage);
  };

  this.sendMessage = function() {
    socket.emit('message', { message: $messageField.html() });
  };

  this.sendCommand = function() {
    var messageFieldText = $messageField.html().split(' ');
    var command = messageFieldText[0];
    var args = messageFieldText.slice(1);
    //socket.emit('message', { message: 'something' });
    socket.emit(command, { args: args });
  };

  this.init();
};
