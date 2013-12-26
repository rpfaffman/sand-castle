// Chat Namespace

var Chat = {};

Chat.Config = {
  socket: io.connect(window.location.protocol + '//' + window.location.host + '/chat'),
  chatDivSelector: '#chat',
  chatTextSelector: '#chat-send-field'
};
