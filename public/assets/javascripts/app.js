$(document).ready(function() {
  // Initialize the Editor
  new Editor.Receiver();

  //Initialize the Chat
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) { chatInterface.renderChatItem(data.sender, data.message); } );
  var chatSender = new Chat.Sender();

  var htmlMirror = new Editor.Interface.EditField.Html().field;
  var cssMirror = new Editor.Interface.EditField.Css().field;
  var javascriptMirror = new Editor.Interface.EditField.Javascript().field;

  //Initializing Editor Interface
  var mirrors = {
    htmlMirror: htmlMirror,
    cssMirror: cssMirror,
    javascriptMirror: javascriptMirror
  };
  var editorInterface = new Editor.Interface(mirrors);
  var editorStreamer = new Editor.Interface.Streamer(mirrors);

  //problem with gutter sizing when there is no timeout.  need to move this into editorfields object.
  setTimeout(function() {
    _.each(mirrors, function(mirror) { mirror.refresh() });
  }, 100);

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

