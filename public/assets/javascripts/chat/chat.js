// Chat Namespace

var Chat = {};

Chat.Config = {
  socket: io.connect(window.location.protocol + '//' + window.location.host + '/chat'),
  chatDivSelector: '#chat',
  chatTextSelector: '#chat-send-field'
};

Chat.initialize = function() {
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) { chatInterface.renderChatItem(data.sender, data.message); } );
};
