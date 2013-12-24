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
  chatReceiver.listen(function(data) {
    chatInterface.renderChatItem(data.sender, data.message);
  } );
  var chatSender = new Chat.Sender();

  //Initializing CodeMirror
  var editorEl = $("#editor")[0];
  var $javascriptEditField = $("#javascriptEditField");
  var javascriptMirror = CodeMirror(editorEl, {
    value: $javascriptEditField.html(),
    mode: 'javascript',
    theme: 'solarized-dark'
  });
  //var cssEditEl = $('body #content')[0];
  //var cssMirror = CodeMirror(cssEditEl, {
    //value: '.some-css { width: 50px; height: 100px; }',
    //mode: 'css',
    //theme: 'solarized-dark'
  //});
  //var htmlEditEl = $('body #content')[0];
  //var htmlmixedMirror = CodeMirror(htmlEditEl, {
    //value: '<html><head><title>This is a test</title></head><body><p>This is a paragraph</p></body></html>',
    //mode: 'xml',
    //htmlMode: true,
    //theme: 'solarized-dark'
  //});

  //Initializing Editor Interface
  var editorInterface = new Editor.Interface();

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

