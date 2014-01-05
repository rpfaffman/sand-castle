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
    this.field.setOption('extraKeys', { 'Shift-Enter': this.submitCode.bind(this) });
    setTimeout(prepare.bind(this), 100); // problem with gutter sizing and scrollbars without refresh
  };

  this.validateJavascript = function() {
    try {
      eval(this.field.getValue());
      socketEmit.bind(this)();
    } catch(err) {
      alert('There was an error processing your Javascript: ' + err.message);
    }
  };

  this.submitCode = function() {
    if(this.type === 'javascript') {
      this.validateJavascript();
    } else {
      socketEmit.bind(this)();
    }
  };

  // private methods
  var prepare = function() {
    refresh.bind(this)();
    hideScrollbars.bind(this)();
  };

  var refresh = function() { this.field.refresh(); };

  var hideScrollbars = function() { $('.CodeMirror-vscrollbar, .CodeMirror-hscrollbar').hide(); };

  var socketEmit = function() { socket.emit('code submit', { type: this.type, code: this.field.getValue() }) };
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

