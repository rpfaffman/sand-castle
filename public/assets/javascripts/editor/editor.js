// Editor Namespace

var Editor = {};

Editor.Config = {
  socket: io.connect(window.location.protocol + '//' + window.location.host + window.location.pathname),

  //interface
  editorContainerSelector: '#editor-container',
  htmlEditSelector: '#htmlEditField',
  cssEditSelector: '#cssEditField',
  javascriptEditSelector: '#javascriptEditField',
  htmlSelector: '#content',
  javascriptSelector: '#javascript',
  cssSelector: '#stylesheet'
};

Editor.initialize = function() {
  var mirrors = {
    htmlMirror: new Editor.Interface.EditField.Html().field,
    cssMirror: new Editor.Interface.EditField.Css().field,
    javascriptMirror: new Editor.Interface.EditField.Javascript().field
  };
  new Editor.Interface(mirrors);
  new Editor.Interface.Streamer(mirrors);
  new Editor.Receiver();
};

