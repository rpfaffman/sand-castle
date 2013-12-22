$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);
  var chatSocket = io.connect(window.location.protocol + '//' + window.location.host + '/chat');

  // Initialize the Editor
  Editor.Config.socket = socket;
  new Editor.Receiver();
  new Editor.Modal(new Editor.Sender());

  //Initialize the Chat
  Chat.Config.socket = socket;
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) {
    chatInterface.renderChatItem(data.sender, data.message);
  } );
  var sender = new Chat.Sender();

  $(document).keypress(function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      chatInterface.renderInputBox(sender.sendMessage);
    };
  });

});

