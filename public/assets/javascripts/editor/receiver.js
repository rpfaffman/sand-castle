Editor.Receiver = function() {
  var socket = Editor.Config.socket;
  var $sandbox = {
    html: $(Editor.Config.htmlSelector),
    javascript: $(Editor.Config.javascriptSelector),
    css: $(Editor.Config.cssSelector)
  };

  this.init = function() {
    this.listen();
  };

  this.listen = function() {
    socket.on('code submit', function(data) {
      var type = data.type, code = data.code;
      (type == 'javascript') ?  eval(code) : $sandbox[type].html(code);
    });
  };

  this.init();
};

