Editor.Receiver = function(socket) {
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
    socket.on('code submit', function(data) { $sandbox[data.type].html(data.code); });
  };

  this.init();
};

