$(document).ready(function() {
  var editSocket = io.connect(window.location.protocol + '//' + window.location.host + '/edit');
  var chatSocket = io.connect(window.location.protocol + '//' + window.location.host + '/chat');

  // Initialize the Editor
  Editor.Config.socket = editSocket;
  new Editor.Receiver();
  new Editor.Modal(new Editor.Sender());

  //Initialize the Chat
  Chat.Config.socket = chatSocket;
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) { chatInterface.renderChatItem(data.sender, data.message); } );
  var chatSender = new Chat.Sender();

  //Initializing CodeMirror
  var htmlMirror = CodeMirror($(Editor.Config.htmlEditSelector)[0], {
    value: '<html>some stupid html</html>',
    mode: 'text/html',
    theme: 'solarized-dark'
  });

  var cssMirror = CodeMirror($(Editor.Config.cssEditSelector)[0], {
    value: '.css { width: 100%; }',
    mode: 'css',
    theme: 'solarized-dark'
  });

  var javascriptMirror = CodeMirror($(Editor.Config.javascriptEditSelector)[0], {
    value: 'function() { console.log("check me out"); }',
    mode: 'javascript',
    theme: 'solarized-dark'
  });

  //Initializing Editor Interface
  var editorInterface = new Editor.Interface();
  var editorStreamer = new Editor.Interface.Streamer({
    htmlMirror: htmlMirror,
    cssMirror: cssMirror,
    javascriptMirror: javascriptMirror
  });

  $('#content').keypress(function(e) {
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

