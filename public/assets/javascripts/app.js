$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);
  var chatSocket = io.connect(window.location.protocol + '//' + window.location.host + '/chat');

  // Initialize the Editor
  Editor.Config.socket = socket;
  new Editor.Receiver();
  new Editor.Modal(new Editor.Sender());

  //Initialize the Chat
  Chat.Config.socket = chatSocket;
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) {
    chatInterface.renderChatItem(data.sender, data.message);
  } );
  var chatSender = new Chat.Sender();

  $(document).keypress(function(e) {
    switch(e.keyCode) {
      case 13: // enter for messages
        e.preventDefault();
        chatInterface.renderInputBox({ prompt: 'message', callback: chatSender.sendMessage });
        break;
      case 47: // '/' - forwardslash for commands (alias)
        e.preventDefault();
        chatInterface.renderInputBox({ prompt: 'command', callback: chatSender.sendCommand });
        break;
    }
  });

});

