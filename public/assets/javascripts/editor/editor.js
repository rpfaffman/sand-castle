// Editor Namespace

var Editor = {};

Editor.Config = {
  socket: io.connect(window.location.protocol + '//' + window.location.host + '/edit'),

  //interface
  editorContainerSelector: '#editor-container',
  htmlEditSelector: '#htmlEditField',
  cssEditSelector: '#cssEditField',
  javascriptEditSelector: '#javascriptEditField',
  htmlSelector: '#content',
  javascriptSelector: '#javascript',
  cssSelector: '#stylesheet'
};

