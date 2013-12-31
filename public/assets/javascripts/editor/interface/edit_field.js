Editor.Interface.EditField = function(args) {
  var socket = Editor.Config.socket;
  var defaultOptions = {
    theme: 'solarized-dark',
    lineNumbers: true,
    lineWrapping: true,
  };

  this.init = function(args) {
    var fieldEl = $(this.fieldSelector)[0];
    this.field = CodeMirror(fieldEl, _.extend(defaultOptions, { mode: this.mode, value: this.value } ));
    this.field.setOption('extraKeys', { 'Shift-Enter': this.validateCode.bind(this) });
    setTimeout(refreshField.bind(this), 100); // problem with gutter sizing without refresh
  };

  this.validateCode = function() {
    try {
      eval(this.field.getValue());
      this.submitCode();
    } catch(err) {
      alert('There was an error processing your Javascript: ' + err.message);
    }
  };

  this.submitCode = function() {
    socket.emit('code submit', { type: this.type, code: this.field.getValue() });
  };

  // private methods

  var refreshField = function() { this.field.refresh(); };
};

// Subclass of Editor.Interface.EditField
Editor.Interface.EditField.Html = function() {
  this.fieldSelector = Editor.Config.htmlEditSelector;
  this.type = 'html';
  this.mode = { name: 'xml', alignCDATA: true };
  this.value = '<h1>Try</h1>\n<h2>editing</h2>\n<h3>this</h3>\n<h4>html</h4>';
  this.init();
};
Editor.Interface.EditField.Html.prototype = new Editor.Interface.EditField();

Editor.Interface.EditField.Css = function() {
  this.fieldSelector = Editor.Config.cssEditSelector;
  this.type = 'css';
  this.mode = 'css';
  this.value = '#content { text-align: center; }';
  this.init();
};
Editor.Interface.EditField.Css.prototype = new Editor.Interface.EditField();

Editor.Interface.EditField.Javascript = function() {
  this.fieldSelector = Editor.Config.javascriptEditSelector;
  this.type = 'javascript';
  this.mode = 'javascript';
  this.value = 'function someFunction() { alert("boom") };';
  this.init();
};
Editor.Interface.EditField.Javascript.prototype = new Editor.Interface.EditField();

