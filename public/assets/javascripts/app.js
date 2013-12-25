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
    theme: 'solarized-dark',
    extraKeys: { "Shift-Enter": function() {
      Editor.Config.socket.emit('code submit', { type: 'html', code: htmlMirror.getValue() });
    }}
  });

  var cssMirror = CodeMirror($(Editor.Config.cssEditSelector)[0], {
    value: '.css { width: 100%; }',
    mode: 'css',
    theme: 'solarized-dark',
    extraKeys: { "Shift-Enter": function() {
      Editor.Config.socket.emit('code submit', { type: 'css', code: cssMirror.getValue() });
    }}
  });

  var javascriptMirror = CodeMirror($(Editor.Config.javascriptEditSelector)[0], {
    value: 'function() { console.log("check me out"); }',
    mode: 'javascript',
    theme: 'solarized-dark',
    extraKeys: { "Shift-Enter": function() {
      Editor.Config.socket.emit('code submit', { type: 'javascript', code: javascriptMirror.getValue() });
    }}
  });

  //Initializing Editor Interface
  var mirrors = {
    htmlMirror: htmlMirror,
    cssMirror: cssMirror,
    javascriptMirror: javascriptMirror
  };
  var editorInterface = new Editor.Interface(mirrors);
  var editorStreamer = new Editor.Interface.Streamer(mirrors);
  var editorSubmitter = new Editor.Interface.Submitter(mirrors);

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

