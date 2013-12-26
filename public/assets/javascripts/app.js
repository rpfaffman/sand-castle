$(document).ready(function() {
  // Initialize the Editor
  new Editor.Receiver();

  //Initialize the Chat
  var chatInterface = new Chat.Interface();
  var chatReceiver = new Chat.Receiver();
  chatReceiver.listen(function(data) { chatInterface.renderChatItem(data.sender, data.message); } );
  var chatSender = new Chat.Sender();

  //Initializing CodeMirror
  var htmlMirror = CodeMirror($(Editor.Config.htmlEditSelector)[0], {
    value: '<h1>Try</h1>\n<h2>editing</h2>\n<h3>this</h3>\n<h4>html</h4>',
    mode: { name: 'xml', alignCDATA: true },
    theme: 'solarized-dark',
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: { "Shift-Enter": function() {
      Editor.Config.socket.emit('code submit', { type: 'html', code: htmlMirror.getValue() });
    }}
  });

  var cssMirror = CodeMirror($(Editor.Config.cssEditSelector)[0], {
    value: '#content { text-align: center; }',
    mode: 'css',
    theme: 'solarized-dark',
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: { "Shift-Enter": function() {
      Editor.Config.socket.emit('code submit', { type: 'css', code: cssMirror.getValue() });
    }}
  });

  var javascriptMirror = CodeMirror($(Editor.Config.javascriptEditSelector)[0], {
    value: 'function someFunction() { alert("boom") };',
    mode: 'javascript',
    theme: 'solarized-dark',
    lineNumbers: true,
    lineWrapping: true,
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

  //problem with gutter sizing when there is no timeout.  need to move this into editorfields object.
  setTimeout(function() {
    _.each(mirrors, function(mirror) { mirror.refresh() });
  }, 100);

  $(document).keypress(function(e) {
    editorInterface.refreshMirrors();
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

